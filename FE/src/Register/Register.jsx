import React, { useState } from "react";
import axios from "axios";
import styles from "./register.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    Last_Name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
    
    setError("");
  };

  const handleRegister = async () => {
    const { username, Last_Name, email, phone, password, confirmPassword } = formData;
    if (!username || !Last_Name || !email || !phone || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const payload = {
        username,
        Last_Name,
        email,
        phone,
        password,
      };
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        payload
      );
      setSuccess(res.data.message || "Registered successfully! Redirecting to login...");
      setError("");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      const serverMsg = err.response?.data;
      if (typeof serverMsg === "string") setError(serverMsg);
      else if (serverMsg?.message) setError(serverMsg.message);
      else if (serverMsg?.error) setError(serverMsg.error);
      else if (Array.isArray(serverMsg?.errors)) {
        setError(serverMsg.errors.map((e) => e.msg).join(", "));
      } else {
        setError("Registration failed. Please try again.");
      }
      setSuccess("");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h2>Register</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />
        <input
          type="text"
          name="Last_Name"
          placeholder="Last_Name"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
        />
        <div className={styles.passwordField}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <button
            type="button"
            className={styles.toggle}
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((p) => !p)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className={styles.passwordField}>
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
          />
          <button
            type="button"
            className={styles.toggle}
            aria-label={showConfirm ? "Hide password" : "Show password"}
            onClick={() => setShowConfirm((p) => !p)}
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
}

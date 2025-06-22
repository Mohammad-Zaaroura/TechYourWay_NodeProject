import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./login.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset message
    setMessage({ text: "", type: "" });
    
    // Basic validation
    if (!email || !password) {
      setMessage({ text: "Please fill in all fields", type: "error" });
      return;
    }
    
    setIsLoading(true);

    try {
      console.log("Sending login request...", { email });
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (res.ok) {
        setMessage({ 
          text: data.message || "Login successful!", 
          type: "success" 
        });
        
        // Store user data in auth context
        if (data.user) {
          login(data.user);
          // Redirect to profile or home page after successful login
          navigate("/");
        } else {
          console.error("User data missing from login response");
          setMessage({ 
            text: "Login successful but user data is missing. Please try again.", 
            type: "error" 
          });
        }
      } else {
        // Handle different HTTP error statuses
        let errorMessage = data.message || "Login failed";
        if (res.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (res.status === 404) {
          errorMessage = "User not found";
        } else if (res.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        }
        
        setMessage({ 
          text: errorMessage, 
          type: "error" 
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage({ 
        text: "Failed to connect to the server. Please check your connection.", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to render message with appropriate styling
  const renderMessage = () => {
    if (!message.text) return null;
    
    const messageClass = message.type === "error" 
      ? styles.errorMessage 
      : styles.successMessage;
    
    return <p className={`${styles.message} ${messageClass}`}>{message.text}</p>;
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2>Login</h2>
        
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <div className={styles.passwordField}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              className={styles.toggle}
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((p) => !p)}
              disabled={isLoading}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {renderMessage()}
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        
        <p className={styles.switch}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.link}>
            Register here
          </Link>
        </p>
        
        <p className={styles.forgotPassword}>
          <Link to="/forgot-password" className={styles.link}>
            Forgot password?
          </Link>
        </p>
      </form>
    </div>
  );
}

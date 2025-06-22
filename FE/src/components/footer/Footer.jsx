import React from "react";
import { Link } from "react-router-dom";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div> 2025 TechYourWay | Group 49</div>
      <div>
        <Link to="/contact">Contact</Link>
      </div>
    </footer>
  );
}

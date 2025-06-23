import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./header.module.css";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { currentUser, logout } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">Tech<span>YourWay</span></Link>
      </div>
      <button
        className={styles.menuButton}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <span className={styles.menuIcon}></span>
      </button>
      <nav aria-label="Primary">
        <ul className={`${styles.navLinks} ${isOpen ? styles.open : ''}`}> 
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li>
            <Link to="/cart" className={styles.cartLink}>
              Cart
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </Link>
          </li>
          {!currentUser ? (
            <>
              <li><Link to="/login">Login</Link></li>
            </>
          ) : (
            <li className={styles.avatarWrapper} ref={dropdownRef}>
              <button className={styles.avatarBtn} onClick={() => setMenuOpen((p)=>!p)} aria-label="Profile menu">
                <FaUserCircle size={28} />
              </button>
              {menuOpen && (
                <ul className={styles.dropdown}>
                  <li><Link to="/profile" onClick={()=>setMenuOpen(false)}>My Profile</Link></li>
                  <li><Link to="/orders" onClick={()=>setMenuOpen(false)}>My Orders</Link></li>
                  <li><button onClick={() => {logout(); setMenuOpen(false);}}>Logout</button></li>
                </ul>
              )}
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

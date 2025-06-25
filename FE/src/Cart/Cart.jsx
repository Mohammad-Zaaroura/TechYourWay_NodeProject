import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Cart.module.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCart();
    // Listen for cart updates from other tabs
    window.addEventListener('storage', loadCart);
    return () => window.removeEventListener('storage', loadCart);
  }, []);

  const loadCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(cart);
    } catch (err) {
      console.error("Error loading cart:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new Event('storage'));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    ).toFixed(2);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading cart...</div>;
  }

  return (
    <div className={styles.container}>
      <h2>Your Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <div className={styles.emptyCart}>
          <p>Your cart is empty</p>
          <Link to="/products" className={styles.continueShopping}>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <img 
                  src={`http://localhost:5000/images/${item.image || 'placeholder.png'}`} 
                  alt={item.name}
                  className={styles.itemImage}
                />
                <div className={styles.itemDetails}>
                  <h3>{item.name}</h3>
                  <div className={styles.price}>{item.price} ₪</div>
                </div>
                <div className={styles.quantityControls}>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <div className={styles.itemSubtotal}>
                  {(item.price * item.quantity).toFixed(2)} ₪
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className={styles.removeButton}
                  aria-label="Remove item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <div className={styles.cartSummary}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{calculateTotal()} ₪</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total</span>
              <span>{calculateTotal()} ₪</span>
            </div>
            
            <button className={styles.checkoutButton}>
              Proceed to Checkout
            </button>
            
            <Link to="/products" className={styles.continueShopping}>
              Continue Shopping
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./Orders.module.css";

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function OrderItem({ order }) {
  return (
    <div className={styles.orderCard}>
      <div className={styles.orderHeader}>
        <div>
          <h3>Order #{order.id}</h3>
          <span className={styles.orderDate}>{formatDate(order.created_at)}</span>
        </div>
        <div className={`${styles.status} ${styles[order.status?.toLowerCase() || 'pending']}`}>
          {order.status || 'Processing'}
        </div>
      </div>
      
      <div className={styles.orderDetails}>
        <div className={styles.itemsList}>
          {order.items?.map((item, index) => (
            <div key={index} className={styles.orderItem}>
              <img 
                src={`http://localhost:5000/images/${item.image || 'default-product.png'}`} 
                alt={item.name}
                className={styles.itemImage}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-product.png';
                }}
              />
              <div className={styles.itemDetails}>
                <h4>{item.name}</h4>
                <div className={styles.itemMeta}>
                  <span>Qty: {item.quantity}</span>
                  <span>${parseFloat(item.unit_price || 0).toFixed(2)} each</span>
                </div>
              </div>
              <div className={styles.itemTotal}>
                ${((item.quantity || 0) * (item.unit_price || 0)).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.orderSummary}>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${parseFloat(order.total || 0).toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span>${parseFloat(order.shipping_cost || 0).toFixed(2)}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Total</span>
            <span>${((order.total || 0) + (order.shipping_cost || 0)).toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {order.shipping_address && (
        <div className={styles.shippingInfo}>
          <h4>Shipping Address</h4>
          <p>{order.shipping_address}</p>
        </div>
      )}
    </div>
  );
}

export default function Orders() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/users/${currentUser.id}/orders`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className={styles.container}>
        <div className={styles.authMessage}>
          <h2>Please log in to view your orders</h2>
          <button 
            onClick={() => navigate('/login')} 
            className={styles.button}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.ordersContainer}>
        <h1>My Orders</h1>
        
        {loading ? (
          <div className={styles.loading}>Loading your orders...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : orders.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No orders found</h3>
            <p>You haven't placed any orders yet.</p>
            <button 
              onClick={() => navigate('/products')} 
              className={styles.button}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {orders.map(order => (
              <OrderItem key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/users/${currentUser.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        setUserData(data.user || data); // Handle both response formats
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) {
    return (
      <div className={styles.container}>
        <div className={styles.authMessage}>
          <h2>Please log in to view your profile</h2>
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
      <div className={styles.profileCard}>
        <h2>My Profile</h2>
        
        {loading ? (
          <div className={styles.loading}>Loading profile data...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <div className={styles.profileContent}>
            <div className={styles.avatar}>
              <span>{userData.username?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
            
            <div className={styles.userInfo}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Username:</span>
                <span className={styles.value}>{userData.username || 'N/A'}</span>
              </div>
              
              <div className={styles.infoRow}>
                <span className={styles.label}>Last Name:</span>
                <span className={styles.value}>{userData.Last_Name || 'N/A'}</span>
              </div>
              
              <div className={styles.infoRow}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{userData.email || 'N/A'}</span>
              </div>
              
              <div className={styles.infoRow}>
                <span className={styles.label}>Phone:</span>
                <span className={styles.value}>{userData.phone || 'N/A'}</span>
              </div>
              
              <div className={styles.infoRow}>
                <span className={styles.label}>Member Since:</span>
                <span className={styles.value}>
                  {userData.created_at 
                    ? new Date(userData.created_at).toLocaleDateString() 
                    : 'N/A'}
                </span>
              </div>
            </div>
            
            <div className={styles.actions}>
              <button 
                onClick={() => navigate('/orders')} 
                className={`${styles.button} ${styles.secondary}`}
              >
                View Orders
              </button>
              <button 
                onClick={handleLogout} 
                className={styles.button}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

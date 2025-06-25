import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './ProductDetail.module.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
        toast.error('Failed to load product details', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (addingToCart) return; // Prevent multiple clicks
    
    setAddingToCart(true);
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    try {
      if (existingItem) {
        existingItem.quantity += 1;
        toast.success(`Added another ${product.name} to cart`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        cart.push({ ...product, quantity: 1 });
        toast.success(`${product.name} added to cart!`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Failed to add item to cart', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading product details...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!product) return <div className={styles.error}>Product not found</div>;

  const imageUrl = `http://localhost:5000/images/${product.image || 'placeholder.jpg'}`;

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        &larr; Back to Products
      </button>
      
      <div className={styles.productContainer}>
        <div className={styles.imageContainer}>
          <img 
            src={imageUrl} 
            alt={product.name}
            className={styles.productImage}
            onError={(e) => {
              console.error(`Failed to load image: ${imageUrl}`);
              e.target.src = '/placeholder.jpg';
            }}
          />
        </div>
        
        <div className={styles.detailsContainer}>
          <h1 className={styles.productName}>{product.name}</h1>
          <div className={styles.price}>{product.price} ₪</div>
          
          <div className={styles.section}>
            <h3>Description</h3>
            <p className={styles.description}>
              {product.description || 'No description available.'}
            </p>
          </div>
          
          <button 
            onClick={addToCart}
            className={styles.addToCartButton}
            disabled={addingToCart}
          >
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

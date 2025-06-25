import React from 'react';
import styles from './Products.module.css';

const ProductDetailsModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{product.name}</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        
        <div className={styles.modalContent}>
          <div className={styles.productImageContainer}>
            <img 
              src={product.image ? `http://localhost:5000/images/${product.image}` : '/placeholder-product.png'} 
              alt={product.name} 
              className={styles.modalProductImage}
            />
          </div>
          
          <div className={styles.productDetails}>
            <p className={styles.productPrice}>₪{parseFloat(product.price).toFixed(2)}</p>
            <p className={styles.productStock}>
              {product.units_in_stock > 0 
                ? `${product.units_in_stock} in stock` 
                : 'Out of stock'}
            </p>
            
            <div className={styles.section}>
              <h3>Description</h3>
              <p>{product.description || 'No description available.'}</p>
            </div>
            
            <div className={styles.section}>
              <h3>Category</h3>
              <p>{product.category_name || product.tag || 'Uncategorized'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Products.module.css';

const EditProductModal = ({ isOpen, onClose, product, onProductUpdated, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Filter out 'All' from categories
  const filteredCategories = categories.filter(cat => cat !== 'All');

  // Initialize form with product data when product prop changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.units_in_stock || product.stock || '',
        category: product.tag || product.category_name || '',
      });
      
      if (product.image) {
        setImagePreview(`http://localhost:5000/images/${product.image}`);
      } else {
        setImagePreview('');
      }
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Only JPG, PNG, and WebP images are allowed');
        return;
      }
      
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      toast.error('Price must be a positive number');
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Add form data
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      // Add image file if selected
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      const response = await axios.put(
        `http://localhost:5000/api/products/${product.id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      toast.success('Product updated successfully!');
      onProductUpdated();
      handleClose();
    } catch (error) {
      console.error('Error updating product:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update product';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
    });
    setSelectedFile(null);
    setImagePreview('');
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Edit Product</h2>
          <button onClick={handleClose} className={styles.closeButton}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.productForm}>
          <div className={styles.formGroup}>
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Price (₪) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {filteredCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>Product Image</label>
            <div className={styles.imageUpload}>
              <input
                type="file"
                id="edit-product-image"
                accept="image/jpeg, image/png, image/webp"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="edit-product-image" className={styles.uploadButton}>
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className={styles.imagePreview} 
                    style={{ maxHeight: '150px' }}
                  />
                ) : (
                  <span>+ Change Image (JPG, PNG, WebP - max 5MB)</span>
                )}
              </label>
            </div>
          </div>
          
          <div className={styles.formActions}>
            <button 
              type="button" 
              onClick={handleClose} 
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitButton} 
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;

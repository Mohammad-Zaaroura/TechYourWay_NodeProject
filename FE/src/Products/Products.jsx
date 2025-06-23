import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./Products.module.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [addingToCart, setAddingToCart] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      console.log('Fetched products:', res.data); // Debug log
      
      if (Array.isArray(res.data)) {
        // Log each product's image path
        res.data.forEach(product => {
          console.log(`Product: ${product.name}, Image: ${product.image}, Full URL: http://localhost:5000/images/${product.image}`);
        });
        
        setProducts(res.data);
        setFilteredProducts(res.data);
        
        // Define common computer hardware categories
        const defaultCategories = [
          "All",
          "Processors (CPU)",
          "Graphics Cards (GPU)",
          "Memory (RAM)",
          "Storage (SSD/HDD)",
          "Motherboards",
          "Power Supplies",
          "PC Cases",
          "Cooling",
          "Accessories"
        ];
        
        // Extract unique categories from products if available, otherwise use defaults
        const productCategories = [...new Set(res.data.map(p => p.tag).filter(Boolean))];
        console.log('Extracted categories from products:', productCategories); // Debug log
        
        const uniqueCats = productCategories.length > 0 
          ? ["All", ...productCategories]
          : defaultCategories;
        console.log('Final categories to display:', uniqueCats); // Debug log
        
        setCategories(uniqueCats);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterProducts(term, selectedCategory);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterProducts(searchTerm, category);
  };

  const filterProducts = (term, category) => {
    console.log('Filtering products. Term:', term, 'Category:', category); // Debug log
    
    let filtered = [...products];
    
    if (term) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) || 
        (p.description && p.description.toLowerCase().includes(term))
      );
    }
    
    if (category !== "All") {
      console.log('Filtering by category:', category); // Debug log
      filtered = filtered.filter(p => {
        console.log(`Product ${p.id} tag:`, p.tag); // Debug log
        return p.tag === category;
      });
    }
    
    console.log('Filtered products count:', filtered.length); // Debug log
    setFilteredProducts(filtered);
  };

  const addToCart = async (product) => {
    if (addingToCart[product.id]) return; // Prevent multiple clicks on the same product
    
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find(item => item.id === product.id);
      
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
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
        
        <div className={styles.categories}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.active : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.productsGrid}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const imageUrl = `http://localhost:5000/images/${product.image || 'placeholder.jpg'}`;
            console.log(`Rendering product ${product.id} with image:`, imageUrl);
            
            return (
              <div key={product.id} className={styles.productCard}>
                <img
                  src={imageUrl}
                  alt={product.name}
                  className={styles.productImage}
                  onError={(e) => {
                    console.error(`Failed to load image: ${imageUrl}`);
                    e.target.src = '/placeholder.jpg';
                  }}
                />
                <div className={styles.productInfo}>
                  <h4>{product.name}</h4>
                  <div className={styles.price}>{product.price} ₪</div>
                  <div className={styles.actions}>
                    <button 
                      className={styles.detailsBtn}
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      View Details
                    </button>
                    <button 
                      className={styles.addToCartBtn}
                      onClick={() => addToCart(product)}
                      disabled={addingToCart[product.id]}
                    >
                      {addingToCart[product.id] ? 'Adding...' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No products found. Try adjusting your search.</p>
        )}
      </div>
    </div>
  );
}

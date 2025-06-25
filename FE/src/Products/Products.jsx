import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Products.module.css";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import ProductDetailsModal from "./ProductDetailsModal";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // חדש
  const [productToDelete, setProductToDelete] = useState(null); // חדש

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      if (Array.isArray(res.data)) {
        setProducts(res.data);
        setFilteredProducts(res.data);

        // Extract unique categories from products
        const productCategories = [
          ...new Set(res.data.map((p) => p.tag).filter(Boolean)),
        ];
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
          "Accessories",
        ];

        const uniqueCats =
          productCategories.length > 0
            ? ["All", ...productCategories]
            : defaultCategories;

        setCategories(uniqueCats);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterProducts(term, selectedCategory);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    filterProducts(searchTerm, category);
  };

  const filterProducts = (term, category) => {
    let filtered = [...products];

    if (term) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          (product.description &&
            product.description.toLowerCase().includes(term))
      );
    }

    if (category && category !== "All") {
      filtered = filtered.filter(
        (product) =>
          product.tag === category || product.category_name === category
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAddProduct = () => {
    setIsAddModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  // פונקציה חדשה למחיקת מוצר בפועל לאחר אישור במודאל
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/products/${productToDelete}`
      );
      toast.success("Product deleted successfully");
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.error || "Failed to delete product");
    } finally {
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleProductAdded = () => {
    fetchProducts(); // Refresh the product list
  };

  const handleProductUpdated = () => {
    fetchProducts(); // Refresh the product list
  };

  const addToCart = async (product) => {
    if (addingToCart[product.id]) return; // Prevent multiple clicks on the same product

    setAddingToCart((prev) => ({ ...prev, [product.id]: true }));

    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItem = cart.find((item) => item.id === product.id);

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

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add item to cart", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setAddingToCart((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const handleImageClick = (product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className={styles.productsContainer}>
      <div className={styles.productsHeader}>
        <h1>Our Products</h1>
        <div className={styles.actions}>
          <button
            className={styles.addProductButton}
            onClick={handleAddProduct}
          >
            + Add Product
          </button>
        </div>
      </div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.categoryFilters}>
        {categories.map((category, index) => (
          <button
            key={index}
            className={`${styles.categoryButton} ${
              selectedCategory === category ? styles.activeCategory : ""
            }`}
            onClick={() => handleCategoryFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.productsGrid}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div
                className={styles.productImage}
                onClick={() => handleImageClick(product)}
              >
                <img
                  src={
                    product.image
                      ? `http://localhost:5000/images/${product.image}`
                      : "/placeholder-product.png"
                  }
                  alt={product.name}
                />
              </div>
              <div className={styles.productInfo}>
                <h3>{product.name}</h3>
                <p className={styles.price}>
                  ₪{parseFloat(product.price).toFixed(2)}
                </p>
                <p className={styles.stock}>
                  {product.units_in_stock > 0
                    ? `${product.units_in_stock} in stock`
                    : "Out of stock"}
                </p>
                <div className={styles.productActions}>
                  <button
                    className={styles.editButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditProduct(product);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setProductToDelete(product.id);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className={styles.addToCartButton}
                    onClick={() => addToCart(product)}
                    disabled={
                      addingToCart[product.id] || product.units_in_stock <= 0
                    }
                  >
                    {addingToCart[product.id] ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noProducts}>No products found</p>
        )}
      </div>

      {/* מודאל מחיקת מוצר */}
      {isDeleteModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Confirm Deletion</h2>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setProductToDelete(null);
                }}
                title="Close"
              >
                &times;
              </button>
            </div>
            <div className={styles.modalContent}>
              <p>Are you sure you want to delete this product?</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginTop: 24,
                }}
              >
                <button
                  className={styles.deleteButton}
                  onClick={handleDeleteProduct}
                >
                  Confirm
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setProductToDelete(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={handleProductAdded}
        categories={categories}
      />

      {editingProduct && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProduct(null);
          }}
          product={editingProduct}
          onProductUpdated={handleProductUpdated}
          categories={categories}
        />
      )}

      {isDetailsModalOpen && (
        <ProductDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          product={selectedProduct}
        />
      )}
    </div>
  );
}

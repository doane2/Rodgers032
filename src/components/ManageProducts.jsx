import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore'; // Import deleteDoc
import { db } from '../../firebaseconfig';
import { MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { CiEdit } from 'react-icons/ci';
import EditProductModal from './EditProductModal'; // Import the modal
import { useNavigate } from 'react-router-dom';
function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // For tracking the product being edited
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal visibility

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(productsList);
      } catch (error) {
        console.error('Error fetching products: ', error);
      }
    };

    fetchProducts();
  }, []);
const navigate =useNavigate()
  // Function to handle opening the edit modal
  const handleEditProduct = (product) => {
    setSelectedProduct(product); // Set the selected product for editing
    setIsModalOpen(true); // Open the modal
  };

  // Function to handle saving the updated product
  const handleSaveProduct = async (updatedProduct) => {
    try {
      const productDocRef = doc(db, 'products', updatedProduct.id);
      await updateDoc(productDocRef, {
        name: updatedProduct.name,
        price: updatedProduct.price,
        imageUrl: updatedProduct.imageUrl,
      });
      // Update the state with the new product info
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
      setIsModalOpen(false); // Close the modal after saving
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  // Function to handle deleting the product
  const handleDeleteProduct = async (productId) => {
    try {
      const productDocRef = doc(db, 'products', productId);
      await deleteDoc(productDocRef);
      // Remove the product from state after deletion
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div>
      <h2>Manage Products</h2>
      {products.length > 0 ? (
        <ul style={styles.productList}>
          {products.map((product) => (
            <li key={product.id} style={styles.productItem}>
              <div style={styles.productDetails}>
                <h3>{product.name}</h3>
                <p>Price: ${product.price}</p>
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.name} style={styles.productImage} />
                )}
              </div>
              <div style={styles.iconContainer}>
                <CiEdit
                  style={styles.icon}
                  onClick={() => handleEditProduct(product)} // Open modal with the selected product
                  title="Edit product"
                />
                <MdDelete
                  style={styles.icon}
                  onClick={() => handleDeleteProduct(product.id)} // Call delete function when clicked
                  title="Delete product"
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products available</p>
      )}

      {/* Render the EditProductModal if the modal is open */}
      {isModalOpen && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onSave={handleSaveProduct}
        />
      )}
<Link to = "/admin/addproducts">
      <button style={styles.addButton}  >+</button></Link>
    </div>
  );
}

// Inline styles for layout and image display
const styles = {
  productList: {
    listStyleType: 'none',
    padding: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  productItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  productDetails: {
    marginBottom: '15px',
  },
  productImage: {
    width: '100%',
    height: 'auto',
    maxHeight: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: '10px',
  },
  icon: {
    cursor: 'pointer',
    fontSize: '24px',
    color: '#333',
    transition: 'color 0.2s',
  },
  addButton: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '24px',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    textAlign: 'center',
  },
};

export default ManageProducts;

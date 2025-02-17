import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseconfig';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../Slices/CartSlices';

function Products() {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch(); // Initialize useDispatch to dispatch actions to the Redux store

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products')); // 'products' is the collection name
        const productsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(productsList);
      } catch (error) {
        console.error('Error fetching products: ', error);
      }
    };

    fetchProducts();
  }, []);

  // Function to handle adding item to cart
  const handleAddToCart = (product) => {
    dispatch(addItemToCart(product)); // Dispatch the action to add the item to the cart
  };

  return (
    <div>
      <h2>Products</h2>
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
              <button
                style={styles.addButton}
                onClick={() => handleAddToCart(product)} // Add the product to the cart when the button is clicked
              >
                Add To Cart
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products available</p>
      )}
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
    marginBottom: '15px', // Adds some spacing between product details and the button
  },
  productImage: {
    width: '100%',
    height: 'auto',
    maxHeight: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  addButton: {
    padding: '10px 15px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: 'auto',
  },
  addButtonHover: {
    backgroundColor: '#0056b3',
  },
};

export default Products;

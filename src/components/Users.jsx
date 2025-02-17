import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseconfig';



function Users() {
  const [users, setUsers] = useState([]);
   // Initialize useDispatch to dispatch actions to the Redux store

  // Fetch products from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users')); // 'products' is the collection name
        const usersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching products: ', error);
      }
    };

    fetchUsers();
  }, []);

  // Function to handle adding item to cart
  console.log(users)

  return (
    <div>
      <h2>Users</h2>
      {users.length > 0 ? (
        <ul style={styles.productList}>
          {users.map((user) => (
            <li key={user.id} style={styles.productItem}>
              <div style={styles.productDetails}>
                <h3> <span className='font-bold'>Name:</span> {user.firstName}  {user.lastName}</h3>  
                
                <p> <span className='font-bold'>email:</span> <span className='text-red-500'>${user.email}</span> </p>
         
              </div>
           
            </li>
          ))}
        </ul>
      ) : (
        <p>No Users available</p>
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

export default Users;

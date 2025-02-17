import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseconfig';

function Orders() {
  const [orders, setOrders] = useState([]);

  // Fetch orders from Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'orders')); // Fetch from 'orders' collection
        const ordersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersList);
      } catch (error) {
        console.error('Error fetching orders: ', error);
      }
    };

    fetchOrders();
  }, []);

  // Function to handle individual order item confirmation and deletion
  const handleConfirmOrderItem = async (orderId, itemId) => {
    try {
      // Find the specific order document
      const orderToUpdate = orders.find((order) => order.id === orderId);
      
      // Filter out the confirmed order item by its unique id
      const itemToConfirm = orderToUpdate.orderItems.find((item) => item.id === itemId);
      const updatedOrderItems = orderToUpdate.orderItems.filter((item) => item.id !== itemId);

      // Update the Firestore document with the updated orderItems array
      const orderDocRef = doc(db, 'orders', orderId);
      await updateDoc(orderDocRef, {
        orderItems: updatedOrderItems,
      });

      // Add confirmed order item to the sales collection
      await addDoc(collection(db, 'sales'), {
        customerId: orderToUpdate.displayName, // Use appropriate field for customer
        email: orderToUpdate.email,
        itemName: itemToConfirm.name,
        itemPrice: itemToConfirm.price,
        itemImage: itemToConfirm.imageUrl,
        confirmedAt: new Date(),
      });

      // Update the UI by removing the confirmed order item
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, orderItems: updatedOrderItems } : order
        )
      );

      console.log(`Order item ${itemId} confirmed and deleted successfully.`);
    } catch (error) {
      console.error('Error confirming order item: ', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h2 className="text-2xl font-bold text-center mb-6">Orders</h2>
      {orders.length > 0 ? (
        <ul style={styles.orderList}>
          {orders.map((order) => (
            <li key={order.id} style={styles.orderItem}>
              <div style={styles.orderDetails}>
                <h3 className="font-bold">Customer: {order.displayName}</h3>
                <p>Email: {order.email}</p>

                {/* Iterate over the orderItems array */}
                {order.orderItems && order.orderItems.length > 0 ? (
                  <ul style={styles.itemList}>
                    {order.orderItems.map((item) => (
                      <li key={item.id} style={styles.item}>
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={styles.productImage}
                        />
                        <div style={styles.itemDetails}>
                          <h4>{item.name}</h4>
                          <p>Price: ${item.price}</p>

                          {/* Confirm Order Item Button */}
                          <button
                            onClick={() => handleConfirmOrderItem(order.id, item.id)}
                            className="mt-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700"
                          >
                            Confirm Order
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No items found for this order.</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No Orders available</p>
      )}
    </div>
  );
}

// Inline styles for layout and image display
const styles = {
  orderList: {
    listStyleType: 'none',
    padding: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  orderItem: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  orderDetails: {
    marginBottom: '15px',
  },
  itemList: {
    listStyleType: 'none',
    padding: 0,
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '15px',
  },
  productImage: {
    width: '100%',
    maxHeight: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  itemDetails: {
    textAlign: 'center',
  },
};

export default Orders;

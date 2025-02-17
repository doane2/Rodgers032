import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseconfig';

function Sales() {
  const [sales, setSales] = useState([]);
  const [expandedSale, setExpandedSale] = useState(null); // State for toggling accordion

  // Fetch sales data from Firestore
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'sales'));
        const salesList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSales(salesList);
      } catch (error) {
        console.error('Error fetching sales: ', error);
      }
    };

    fetchSales();
  }, []);

  // Toggle accordion for the selected sale
  const toggleAccordion = (saleId) => {
    setExpandedSale(expandedSale === saleId ? null : saleId);
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h2 className="text-2xl font-bold text-center mb-6">Sales History</h2>
      {sales.length > 0 ? (
        <ul style={styles.salesList}>
          {sales.map((sale) => (
            <li key={sale.id} style={styles.saleItem}>
              {/* Displaying sales item image and basic info */}
              <img
                src={sale.itemImage}
                alt={sale.itemName}
                style={styles.productImage}
              />
              <h3 className="font-bold">{sale.itemName}</h3>
              <p>Price: ${sale.itemPrice}</p>

              {/* Dropdown button to toggle accordion */}
              <button
                style={styles.accordionButton}
                onClick={() => toggleAccordion(sale.id)}
              >
                {expandedSale === sale.id ? 'Hide Details' : 'Show Details'}
              </button>

              {/* Conditionally render the details based on accordion state */}
              {expandedSale === sale.id && (
                <div style={styles.saleDetails}>
                  <p>Email: {sale.email}</p>
                  <p>Customer ID: {sale.customerId}</p>
                  <p>
                    Confirmed At:{' '}
                    {sale.confirmedAt && sale.confirmedAt.seconds
                      ? new Date(sale.confirmedAt.seconds * 1000).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No Sales Records available</p>
      )}
    </div>
  );
}

// Inline styles for layout and image display
const styles = {
  salesList: {
    listStyleType: 'none',
    padding: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  saleItem: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  saleDetails: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#f1f1f1',
    borderRadius: '8px',
    border: '1px solid #ccc',
    textAlign: 'left',
  },
  productImage: {
    width: '100%',
    maxHeight: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  accordionButton: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default Sales;

import React, { useState } from 'react';

function EditProductModal({ product, onClose, onSave }) {
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(updatedProduct); // Call the save function passed from the parent
  };

  return (
    <div style={styles.modalBackdrop}>
      <div style={styles.modalContent}>
        <h2>Edit Product</h2>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={updatedProduct.name}
            onChange={handleChange}
            style={styles.input}
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={updatedProduct.price}
            onChange={handleChange}
            style={styles.input}
          />
        </label>
        <label>
          Image URL:
          <input
            type="text"
            name="imageUrl"
            value={updatedProduct.imageUrl}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <div style={styles.buttonContainer}>
          <button onClick={handleSave} style={styles.saveButton}>
            Save
          </button>
          <button onClick={onClose} style={styles.closeButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal styles
const styles = {
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    textAlign: 'center',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '8px',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  saveButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  closeButton: {
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default EditProductModal;

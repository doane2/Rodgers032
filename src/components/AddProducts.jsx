import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from "../../firebaseconfig"; // Import Firebase storage as well

function AddProducts() {
  // State to hold form inputs
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    type: '',
    color: '',
  });

  const [image, setImage] = useState(null); // State to hold the selected image
  const [uploadProgress, setUploadProgress] = useState(0); // State to track upload progress

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageSource('camera'); // Set image source as camera
      const newImages = [...images];
      newImages[currentCurtainIndex] = file;
      setImages(newImages);

      // Update the current curtain with the captured photo URL
      const updatedCurtains = [...curtains];
      updatedCurtains[currentCurtainIndex].imageUrl = URL.createObjectURL(file);
      setCurtains(updatedCurtains);
    }
  };






  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      
      if (image) {
        // Upload image to Firebase Storage
        const imageRef = ref(storage, `products/${image.name}`);
        const uploadTask = uploadBytesResumable(imageRef, image);
        
        // Listen for state changes in the upload process
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress); // Track upload progress
          },
          (error) => {
            console.error('Error uploading image: ', error);
            alert('Failed to upload image');
          },
          async () => {
            // Get the download URL once the upload is complete
            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
            // Add the product details along with the image URL to Firestore
            await addDoc(collection(db, 'products'), {
              name: productData.name,
              price: parseFloat(productData.price), // Ensure price is a number
              type: productData.type,
              color: productData.color,
              imageUrl, // Save the image URL
            });
            // Clear form fields after submission
            setProductData({
              name: '',
              price: '',
              type: '',
              color: '',
            });
            setImage(null); // Clear the selected image
            setUploadProgress(0); // Reset upload progress
            alert('Product added successfully!');
          }
        );
      }
    } catch (error) {
      console.error('Error adding product: ', error);
      alert('Failed to add product');
    }
  };

  // Basic inline styles
  const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f4f4f4',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    formGroup: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      padding: '10px',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    button: {
      padding: '10px 15px',
      fontSize: '16px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      marginTop: '15px', // Adds some space above the button
    },
    progressBar: {
      height: '10px',
      backgroundColor: '#007bff',
      borderRadius: '5px',
      width: `${uploadProgress}%`,
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <div>
            <label style={styles.label}>Name:</label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div>
            <label style={styles.label}>Price:</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div>
            <label style={styles.label}>Type:</label>
            <input
              type="text"
              name="type"
              value={productData.type}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div>
            <label style={styles.label}>Color:</label>
            <input
              type="text"
              name="color"
              value={productData.color}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div>
            <label style={styles.label}>Image:</label>
            <input
              type="file"
              onChange={handleImageChange}
              style={styles.input}
              accept="image/*"
            />
          </div>

          <div>
              <label>Take Photo:</label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageCapture}
                className="border p-2 w-full"
              />
            </div>









        </div>
        {uploadProgress > 0 && (
          <div style={styles.progressBar}></div>
        )}
        <button type="submit" style={styles.button}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddProducts;

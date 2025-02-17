import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseconfig';

// Firestore collection reference
const productCollectionRef = collection(db, 'products');

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Product'], // Allows us to invalidate and refetch products
  endpoints: (builder) => ({
    fetchProducts: builder.query({
      async queryFn() {
        try {
          const querySnapshot = await getDocs(productCollectionRef);
          const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          return { data: products };
        } catch (error) {
          return { error: error.message };
        }
      },
      providesTags: (result) => 
        result ? [...result.map(({ id }) => ({ type: 'Product', id })), 'Product'] : ['Product'],
    }),
    addProduct: builder.mutation({
      async queryFn(newProduct) {
        try {
          await addDoc(productCollectionRef, newProduct);
          return { data: 'Product added successfully' };
        } catch (error) {
          return { error: error.message };
        }
      },
      invalidatesTags: ['Product'], // After adding, refetch the products
    }),
    updateProduct: builder.mutation({
      async queryFn({ id, updatedProduct }) {
        try {
          const productDoc = doc(db, 'products', id);
          await updateDoc(productDoc, updatedProduct);
          return { data: 'Product updated successfully' };
        } catch (error) {
          return { error: error.message };
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }], // Refetch updated product
    }),
    deleteProduct: builder.mutation({
      async queryFn(id) {
        try {
          const productDoc = doc(db, 'products', id);
          await deleteDoc(productDoc);
          return { data: 'Product deleted successfully' };
        } catch (error) {
          return { error: error.message };
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Product', id }], // Refetch after deletion
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useFetchProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;

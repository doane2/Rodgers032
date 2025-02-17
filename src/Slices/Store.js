import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import CartSlices from './CartSlices';
import orderSlice from './orderSlice';
export const store = configureStore({
  reducer: {
    cart: CartSlices, 
    order: orderSlice 
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

setupListeners(store.dispatch);

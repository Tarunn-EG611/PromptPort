import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import templateReducer from './slices/templateSlice';
import collectionReducer from './slices/collectionSlice';

export const setupStore = (preloadedState) =>
  configureStore({
    reducer: {
      auth: authReducer,
      templates: templateReducer,
      collections: collectionReducer,
    },
    preloadedState,
  });

export const store = setupStore();

export default store;
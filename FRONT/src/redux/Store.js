// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import UserReducer from './slices/UserSlice';

const store = configureStore({
  reducer: UserReducer,
});

export default store;

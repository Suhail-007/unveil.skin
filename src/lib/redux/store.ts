import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for Supabase user/session objects
        ignoredActions: ['auth/setSession'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.user', 'payload.session'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user', 'auth.session'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

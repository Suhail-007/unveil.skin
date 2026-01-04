import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isGuest: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  session: null,
  isGuest: true,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<{ user: User | null; session: Session | null }>) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.isGuest = !action.payload.user;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearSession: (state) => {
      state.user = null;
      state.session = null;
      state.isGuest = true;
      state.loading = false;
    },
    setGuest: (state) => {
      state.isGuest = true;
      state.user = null;
      state.session = null;
      state.loading = false;
    },
  },
});

export const { setSession, setLoading, clearSession, setGuest } = authSlice.actions;
export default authSlice.reducer;

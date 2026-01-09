/**
 * Auth Service - Handles all authentication API calls
 */

import type { User, Session } from '@supabase/supabase-js';

// Route constants
export const AUTH_ROUTES = {
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  LOGOUT: '/api/auth/logout',
  SESSION: '/api/auth/session',
  REFRESH: '/api/auth/refresh',
} as const;

// Types
export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error?: string;
  requiresEmailConfirmation?: boolean;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name?: string;
}

// API Functions
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(AUTH_ROUTES.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }

  return data;
}

export async function signup(credentials: SignupCredentials): Promise<AuthResponse> {
  const response = await fetch(AUTH_ROUTES.SIGNUP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Signup failed');
  }

  return data;
}

export async function logout(): Promise<void> {
  const response = await fetch(AUTH_ROUTES.LOGOUT, {
    method: 'POST',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Logout failed');
  }
}

export async function getSession(): Promise<AuthResponse> {
  const response = await fetch(AUTH_ROUTES.SESSION, {
    credentials: 'include', // Important: include cookies
  });
  const data = await response.json();
  console.log('📱 getSession response:', data);
  return data;
}

export async function refreshSession(): Promise<AuthResponse> {
  const response = await fetch(AUTH_ROUTES.REFRESH, {
    method: 'POST',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Session refresh failed');
  }

  return data;
}

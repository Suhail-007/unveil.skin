/**
 * Waitlist Service - Handles waitlist API calls
 */

// Route constants
export const WAITLIST_ROUTES = {
  JOIN: '/api/waitlist',
} as const;

// Types
export interface JoinWaitlistParams {
  email: string;
  name?: string;
}

export interface WaitlistResponse {
  message: string;
  error?: string;
}

// API Functions
export async function joinWaitlist(params: JoinWaitlistParams): Promise<WaitlistResponse> {
  const response = await fetch(WAITLIST_ROUTES.JOIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to join waitlist');
  }

  return data;
}

import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68838b8a85a1a8ef5e4d2352", 
  requiresAuth: true // Ensure authentication is required for all operations
});

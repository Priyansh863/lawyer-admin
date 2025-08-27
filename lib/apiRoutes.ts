// Centralized API route constants
const API_ROUTES = {
  CLIENTS_LIST: (offset = 0, limit = 10, accountType = 'client') => `user/clients?offset=${offset}&limit=${limit}&accountType=${encodeURIComponent(accountType)}`,
  PAYMENTS: 'payment',
  POLICIES: 'policy',
  CONTENT: 'content',
  ADMIN_LOGIN: 'auth/admin-login',
  // Add other routes as needed
};

export default API_ROUTES; 
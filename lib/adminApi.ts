import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance with default config
const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Dashboard Statistics
export const getDashboardStats = async () => {
  try {
    const response = await adminApi.get('/admin/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// User Roles Distribution
export const getUserRolesDistribution = async () => {
  try {
    const response = await adminApi.get('/admin/user-roles');
    return response.data;
  } catch (error) {
    console.error('Error fetching user roles distribution:', error);
    throw error;
  }
};

// Recent Activity (Latest 5 notifications)
export const getRecentActivity = async () => {
  try {
    const response = await adminApi.get('/admin/recent-activity');
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
};

// All Notifications (Paginated)
export const getAllNotifications = async (page = 1, limit = 20, type = 'all') => {
  try {
    const response = await adminApi.get('/admin/notifications', {
      params: { page, limit, type }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// User Management
export const getAllUsers = async (search = '', status = 'all', role = 'all') => {
  try {
    const response = await adminApi.get('/admin/users', {
      params: { search, status, role }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Verify Lawyer
export const verifyLawyer = async (userId: string) => {
  try {
    const response = await adminApi.post(`/admin/users/${userId}/verify`);
    return response.data;
  } catch (error) {
    console.error('Error verifying lawyer:', error);
    throw error;
  }
};

// Reject Lawyer
export const rejectLawyer = async (lawyerId: string, reason: string) => {
  const response = await fetch(`${API_BASE_URL}/admin/users/${lawyerId}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason }),
  });
  
  return response.json();
};

// Get User Details
export const getUserDetails = async (userId: string) => {
  try {
    const response = await adminApi.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

// Get Pending Lawyers
export const getPendingLawyers = async (search: string = '', status: string = 'pending') => {
  try {
    const response = await adminApi.get('/admin/lawyers/pending', {
      params: { search, status }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching pending lawyers:', error);
    throw error;
  }
};

// Export Users
export const exportUsers = async (role: string = 'all') => {
  try {
    const response = await adminApi.get('/users/export', {
      params: { role }
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting users:', error);
    throw error;
  }
};

// Transaction APIs
export const getTransactions = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  sortBy?: string;
  sortOrder?: string;
}) => {
  try {
    const response = await adminApi.get('/admin/transactions', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

// Content Monitoring APIs
export const getContentMonitoring = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  sortBy?: string;
  sortOrder?: string;
}) => {
  try {
    const response = await adminApi.get('/admin/content', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

export const updateContentStatus = async (contentId: string, status: string, type: string) => {
  try {
    const response = await adminApi.put(`/admin/content/${contentId}/status`, { status, type });
    return response.data;
  } catch (error) {
    console.error('Error updating content status:', error);
    throw error;
  }
};

// Admin profile management
export const getAdminProfile = async () => {
  try {
    const response = await adminApi.get('/admin/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    throw error;
  }
};

export const updateAdminProfile = async (profileData: any) => {
  try {
    const response = await adminApi.put('/admin/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating admin profile:', error);
    throw error;
  }
};

export const getPresignedUrl = async (filePath: string, fileFormat: string) => {
  try {
    const response = await adminApi.post('/user/get-presigned-url', { filePath, fileFormat });
    return response.data;
  } catch (error) {
    console.error('Error getting presigned URL:', error);
    throw error;
  }
};

// Toggle User Active Status
export const toggleUserActive = async (userId: string, is_active: number) => {
  try {
    const response = await adminApi.patch(`/admin/users/${userId}/toggle-active`, { is_active });
    return response.data;
  } catch (error) {
    console.error('Error toggling user active status:', error);
    throw error;
  }
};

// Toggle User Verified Status
export const toggleUserVerified = async (userId: string, is_verified: number) => {
  try {
    const response = await adminApi.patch(`/admin/users/${userId}/toggle-verified`, { is_verified });
    return response.data;
  } catch (error) {
    console.error('Error toggling user verified status:', error);
    throw error;
  }
};

export default adminApi;

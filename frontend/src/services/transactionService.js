import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const transactionService = {
  // 1. GET ALL TRANSACTIONS
  getAllTransactions: async () => {
    const response = await apiClient.get('/transactions');
    return response.data;
  },

  // 2. GET TRANSACTION BY ID
  getTransactionById: async (id) => {
    const response = await apiClient.get(`/transactions/${id}`);
    return response.data;
  },

  // 3. CREATE TRANSACTION
  createTransaction: async (data) => {
    const response = await apiClient.post('/transactions', data);
    return response.data;
  },

  // 4. UPDATE TRANSACTION
  updateTransaction: async (id, data) => {
    const response = await apiClient.put(`/transactions/${id}`, data);
    return response.data;
  },

  // 5. DELETE TRANSACTION
  deleteTransaction: async (id) => {
    const response = await apiClient.delete(`/transactions/${id}`);
    return response.data;
  },

  // 6. SEARCH TRANSACTIONS
  searchTransactions: async (query) => {
    const response = await apiClient.get('/transactions/search', {
      params: { query, title: query },
    });
    return response.data;
  },

  // 7. FILTER TRANSACTIONS
  filterTransactions: async (params) => {
    const cleanParams = {};
    if (params.type) cleanParams.type = params.type;
    if (params.category) cleanParams.category = params.category;
    if (params.fromDate) cleanParams.fromDate = params.fromDate;
    if (params.toDate) cleanParams.toDate = params.toDate;

    const response = await apiClient.get('/transactions/filter', {
      params: cleanParams,
    });
    return response.data;
  },

  // 8. GET SUMMARY
  getSummary: async () => {
    const response = await apiClient.get('/transactions/summary');
    return response.data;
  },

  // 9. GET CATEGORY SUMMARY
  getCategorySummary: async () => {
    const response = await apiClient.get('/transactions/summary/categories');
    return response.data;
  },

  // 10. GET MONTHLY SUMMARY
  getMonthlySummary: async (year, month) => {
    const response = await apiClient.get('/transactions/summary/monthly', {
      params: { year, month },
    });
    return response.data;
  },
};

export default transactionService;

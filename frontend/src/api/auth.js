import apiClient from './client';

/**
 * Register a new user
 * @param {string} username 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{user: Object, token: string}>}
 */
export const register = async (username, email, password) => {
  const response = await apiClient.post('/auth/register', {
    username,
    email,
    password,
  });
  return response.data;
};

/**
 * Login with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{user: Object, token: string}>}
 */
export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', {
    email,
    password,
  });
  return response.data;
};


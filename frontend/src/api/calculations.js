import apiClient from './client';

/**
 * Get all root calculations (starting numbers)
 * @param {number} limit 
 * @param {number} skip 
 * @returns {Promise<{calculations: Array, total: number, limit: number, skip: number}>}
 */
export const getRootCalculations = async (limit = 50, skip = 0) => {
  const response = await apiClient.get('/calculations', {
    params: { limit, skip },
  });
  return response.data;
};

/**
 * Get a calculation with its children and breadcrumb
 * @param {string} id 
 * @param {number} limit 
 * @returns {Promise<{calculation: Object, children: Array, breadcrumb: Array}>}
 */
export const getCalculationWithChildren = async (id, limit = 50) => {
  const response = await apiClient.get(`/calculations/${id}/children`, {
    params: { limit },
  });
  return response.data;
};

/**
 * Recursively fetch full tree structure for a calculation
 * @param {string} id - Root calculation ID
 * @param {number} maxDepth - Maximum depth to fetch (default: 10)
 * @returns {Promise<Object>} - Calculation with nested children
 */
export const getFullTree = async (id, maxDepth = 10) => {
  const fetchNode = async (nodeId, currentDepth = 0) => {
    if (currentDepth >= maxDepth) {
      return null;
    }

    try {
      const response = await getCalculationWithChildren(nodeId, 100);
      const node = { ...response.calculation, children: [] };

      // Recursively fetch children
      if (response.children && response.children.length > 0) {
        const childrenPromises = response.children.map((child) => {
          const childId = child.id || child._id;
          return fetchNode(childId, currentDepth + 1);
        });
        const children = await Promise.all(childrenPromises);
        node.children = children.filter(Boolean);
      }

      return node;
    } catch (error) {
      console.error(`Error fetching node ${nodeId}:`, error);
      // If we can't fetch children, return null to skip this branch
      return null;
    }
  };

  return fetchNode(id, 0);
};

/**
 * Create a new starting number (root calculation)
 * @param {number} value 
 * @returns {Promise<{calculation: Object}>}
 */
export const createStartingNumber = async (value) => {
  const response = await apiClient.post('/calculations', {
    value,
  });
  return response.data;
};

/**
 * Add an operation to a calculation
 * @param {string} parentId 
 * @param {string} operation 
 * @param {number} operand 
 * @returns {Promise<{calculation: Object}>}
 */
export const addOperation = async (parentId, operation, operand) => {
  const response = await apiClient.post(`/calculations/${parentId}/respond`, {
    operation,
    operand,
  });
  return response.data;
};

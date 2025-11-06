/**
 * Get the ID from a calculation object
 * Handles both 'id' and '_id' fields (MongoDB compatibility)
 * @param {Object} calculation - Calculation object
 * @returns {string|null} - The calculation ID or null if not found
 */
export const getCalculationId = (calculation) => {
  if (!calculation) return null;
  return calculation.id || calculation._id || null;
};


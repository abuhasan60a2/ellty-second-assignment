/**
 * Format date as relative time
 * @param {string} dateString - ISO 8601 date string
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
};

/**
 * Get operation symbol
 * @param {string} operation - Operation type
 * @returns {string} Operation symbol
 */
export const getOperationSymbol = (operation) => {
  const symbols = {
    add: '+',
    subtract: '-',
    multiply: '×',
    divide: '÷',
  };
  return symbols[operation] || operation;
};

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format calculation display string
 * @param {Object} calculation - Calculation object
 * @returns {string} Formatted calculation string
 */
export const formatCalculation = (calculation) => {
  if (calculation.operation === 'start') {
    return `Start: ${formatNumber(calculation.value)}`;
  }
  return `${getOperationSymbol(calculation.operation)}${formatNumber(calculation.operand)} = ${formatNumber(calculation.value)}`;
};


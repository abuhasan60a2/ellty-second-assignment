import { Operation } from '../types';
import { ValidationError } from './errors';

/**
 * Perform mathematical calculation
 * @param left - Left operand (parent value)
 * @param operation - Mathematical operation to perform
 * @param right - Right operand
 * @returns Calculated result
 * @throws ValidationError for division by zero or invalid operations
 */
export const calculate = (left: number, operation: Operation, right: number): number => {
  switch (operation) {
    case 'add':
      return left + right;
    
    case 'subtract':
      return left - right;
    
    case 'multiply':
      return left * right;
    
    case 'divide':
      if (right === 0) {
        throw new ValidationError('Division by zero is not allowed');
      }
      return left / right;
    
    case 'start':
      // Start operation doesn't use right operand
      return left;
    
    default:
      throw new ValidationError(`Invalid operation: ${operation}`);
  }
};


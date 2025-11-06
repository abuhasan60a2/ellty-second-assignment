import { z } from 'zod';

/**
 * Registration form validation schema
 */
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z
    .string()
    .email('Invalid email format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

/**
 * Starting number form validation schema
 */
export const startingNumberSchema = z.object({
  value: z
    .number({
      required_error: 'Value is required',
      invalid_type_error: 'Value must be a number',
    })
    .finite('Value must be a finite number')
    .refine((val) => Math.abs(val) < 1e15, 'Value must be less than 1e15'),
});

/**
 * Operation form validation schema
 */
export const operationSchema = z.object({
  operation: z.enum(['add', 'subtract', 'multiply', 'divide'], {
    required_error: 'Operation is required',
  }),
  operand: z
    .number({
      required_error: 'Operand is required',
      invalid_type_error: 'Operand must be a number',
    })
    .finite('Operand must be a finite number'),
}).refine((data) => {
  if (data.operation === 'divide' && data.operand === 0) {
    return false;
  }
  return true;
}, {
  message: 'Cannot divide by zero',
  path: ['operand'],
});


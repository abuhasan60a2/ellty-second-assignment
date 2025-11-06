import { Router } from 'express';
import { z } from 'zod';
import * as calculationsController from '../controllers/calculations.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';

const router = Router();

// Validation schemas
const createStartingNumberSchema = z.object({
  value: z
    .number()
    .finite('Value must be a finite number')
    .refine((val) => Math.abs(val) < 1e15, {
      message: 'Value must be less than 1e15 in absolute value',
    }),
});

const addOperationSchema = z.object({
  operation: z.enum(['add', 'subtract', 'multiply', 'divide'], {
    message: 'Operation must be one of: add, subtract, multiply, divide',
  }),
  operand: z.number().finite('Operand must be a finite number'),
});

// Public routes
router.get('/', calculationsController.getAllRoots);
router.get('/:id/children', calculationsController.getCalculationWithChildren);

// Protected routes
router.post(
  '/',
  authenticate,
  validateRequest(createStartingNumberSchema),
  calculationsController.createStartingNumber
);

router.post(
  '/:id/respond',
  authenticate,
  validateRequest(addOperationSchema),
  calculationsController.addOperation
);

export default router;

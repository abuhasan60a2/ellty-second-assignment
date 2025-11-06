import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as calculationsService from '../services/calculations.service';

/**
 * Get all root calculations
 * GET /api/calculations
 */
export const getAllRoots = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = parseInt(req.query.skip as string) || 0;

    const result = await calculationsService.getAllRoots(limit, skip);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get calculation with children and breadcrumb
 * GET /api/calculations/:id/children
 */
export const getCalculationWithChildren = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    const result = await calculationsService.getCalculationWithChildren(id, limit);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new starting number
 * POST /api/calculations
 */
export const createStartingNumber = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { value } = req.body;
    const userId = req.user!._id.toString();
    const username = req.user!.username;

    const calculation = await calculationsService.createStartingNumber(
      value,
      userId,
      username
    );

    res.status(201).json({
      success: true,
      data: {
        calculation,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add an operation to a calculation
 * POST /api/calculations/:id/respond
 */
export const addOperation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { operation, operand } = req.body;
    const userId = req.user!._id.toString();
    const username = req.user!.username;

    const calculation = await calculationsService.addOperation(
      id,
      operation,
      operand,
      userId,
      username
    );

    res.status(201).json({
      success: true,
      data: {
        calculation,
      },
    });
  } catch (error) {
    next(error);
  }
};


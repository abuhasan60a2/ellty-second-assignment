import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const result = await authService.register(username, email, password);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: result.user._id,
          username: result.user.username,
          email: result.user.email,
        },
        token: result.token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: result.user._id,
          username: result.user.username,
          email: result.user.email,
        },
        token: result.token,
      },
    });
  } catch (error) {
    next(error);
  }
};


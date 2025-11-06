import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { IJWTPayload } from '../types';
import { UnauthorizedError } from './errors';

/**
 * Generate JWT token for user
 * @param userId - User ID to encode in token
 * @returns JWT token string
 */
export const generateToken = (userId: string): string => {
  const payload: IJWTPayload = { userId };
  
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: '7d',
    algorithm: 'HS256',
  });
};

/**
 * Verify and decode JWT token
 * @param token - JWT token string
 * @returns Decoded payload with userId
 * @throws UnauthorizedError if token is invalid
 */
export const verifyToken = (token: string): IJWTPayload => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as IJWTPayload;
    return decoded;
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token');
  }
};


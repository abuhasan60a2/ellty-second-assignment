import { Request } from 'express';
import { Document } from 'mongoose';

// Operation type
export type Operation = 'start' | 'add' | 'subtract' | 'multiply' | 'divide';

// User interface
export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Calculation interface
export interface ICalculation extends Document {
  _id: string;
  authorId: string;
  authorUsername: string;
  value: number;
  operation: Operation;
  operand: number | null;
  parentId: string | null;
  rootId: string;
  depth: number;
  childCount: number;
  createdAt: Date;
}

// JWT payload type
export interface IJWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

// Extended Express Request with user property
export interface AuthRequest extends Request {
  user?: IUser;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: any;
  };
}


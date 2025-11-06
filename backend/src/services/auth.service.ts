import bcrypt from 'bcrypt';
import { User } from '../models/User.model';
import { ConflictError, UnauthorizedError } from '../utils/errors';
import { generateToken } from '../utils/jwt';
import { IUser } from '../types';

const SALT_ROUNDS = 10;

/**
 * Register a new user
 * @param username - Username (3-20 chars, alphanumeric + underscore)
 * @param email - Valid email address
 * @param password - Password (min 6 chars)
 * @returns User object and JWT token
 * @throws ConflictError if username or email already exists
 */
export const register = async (
  username: string,
  email: string,
  password: string
): Promise<{ user: IUser; token: string }> => {
  // Check if username already exists
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new ConflictError('Username already exists');
  }

  // Check if email already exists
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new ConflictError('Email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  console.log(`User created: ${user.username} (${user._id})`);

  // Generate JWT token
  const token = generateToken(user._id.toString());

  return {
    user,
    token,
  };
};

/**
 * Login user
 * @param email - User's email
 * @param password - User's password
 * @returns User object and JWT token
 * @throws UnauthorizedError if credentials are invalid
 */
export const login = async (
  email: string,
  password: string
): Promise<{ user: IUser; token: string }> => {
  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  console.log(`User logged in: ${user.username} (${user._id})`);

  // Generate JWT token
  const token = generateToken(user._id.toString());

  return {
    user,
    token,
  };
};


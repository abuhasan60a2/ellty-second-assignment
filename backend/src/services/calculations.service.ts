import { Calculation } from '../models/Calculation.model';
import { ICalculation, Operation } from '../types';
import { NotFoundError, ValidationError } from '../utils/errors';
import { calculate } from '../utils/calculator';

const MAX_DEPTH = 100;

/**
 * Get all root calculations (starting numbers)
 * @param limit - Maximum number of results (default 50, max 100)
 * @param skip - Number of results to skip (default 0)
 * @returns Array of root calculations and pagination info
 */
export const getAllRoots = async (
  limit: number = 50,
  skip: number = 0
): Promise<{ calculations: ICalculation[]; total: number; limit: number; skip: number }> => {
  // Enforce max limit
  const actualLimit = Math.min(limit, 100);

  // Find calculations where parentId is null (roots)
  const calculations = await Calculation.find({ parentId: null })
    .sort({ createdAt: -1 })
    .limit(actualLimit)
    .skip(skip)
    .lean()
    .exec();

  // Get total count for pagination
  const total = await Calculation.countDocuments({ parentId: null });

  return {
    calculations: calculations as unknown as ICalculation[],
    total,
    limit: actualLimit,
    skip,
  };
};

/**
 * Get calculation with its children and breadcrumb
 * @param id - Calculation ID
 * @param limit - Maximum number of children to return (default 50)
 * @returns Calculation, children array, and breadcrumb array
 * @throws NotFoundError if calculation not found
 */
export const getCalculationWithChildren = async (
  id: string,
  limit: number = 50
): Promise<{
  calculation: ICalculation;
  children: ICalculation[];
  breadcrumb: ICalculation[];
}> => {
  // Find calculation by id
  const calculation = await Calculation.findById(id).lean().exec();

  if (!calculation) {
    throw new NotFoundError('Calculation not found');
  }

  // Find direct children
  const children = await Calculation.find({ parentId: id })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()
    .exec();

  // Build breadcrumb
  const breadcrumb = await buildBreadcrumb(id);

  return {
    calculation: calculation as unknown as ICalculation,
    children: children as unknown as ICalculation[],
    breadcrumb,
  };
};

/**
 * Build breadcrumb by walking up parent chain
 * @param calculationId - Starting calculation ID
 * @returns Array of calculations from root to current
 */
export const buildBreadcrumb = async (calculationId: string): Promise<ICalculation[]> => {
  const breadcrumb: ICalculation[] = [];
  let currentId: string | null = calculationId;

  // Walk up the parent chain
  while (currentId) {
    const calc = await Calculation.findById(currentId).lean().exec();

    if (!calc) {
      break;
    }

    breadcrumb.unshift(calc as unknown as ICalculation);
    currentId = calc.parentId;
  }

  return breadcrumb;
};

/**
 * Create a new starting number (root calculation)
 * @param value - Starting number value
 * @param userId - User ID creating the calculation
 * @param username - Username of the creator
 * @returns Created calculation
 * @throws ValidationError if value is invalid
 */
export const createStartingNumber = async (
  value: number,
  userId: string,
  username: string
): Promise<ICalculation> => {
  // Validate value is finite
  if (!Number.isFinite(value)) {
    throw new ValidationError('Value must be a finite number');
  }

  // Check absolute value limit
  if (Math.abs(value) >= 1e15) {
    throw new ValidationError('Value must be less than 1e15 in absolute value');
  }

  // Create root calculation (rootId will be set after creation)
  const calculation = await Calculation.create({
    authorId: userId,
    authorUsername: username,
    value,
    operation: 'start',
    operand: null,
    parentId: null,
    depth: 0,
    childCount: 0,
  });

  // Set rootId to self after creation
  calculation.rootId = calculation._id.toString();
  await calculation.save();

  console.log(`Starting number created: ${value} by ${username} (${calculation._id})`);

  return calculation;
};

/**
 * Add an operation to an existing calculation
 * @param parentId - Parent calculation ID
 * @param operation - Mathematical operation
 * @param operand - Operand value
 * @param userId - User ID creating the calculation
 * @param username - Username of the creator
 * @returns Created calculation
 * @throws NotFoundError if parent not found
 * @throws ValidationError for invalid operations or depth limit
 */
export const addOperation = async (
  parentId: string,
  operation: Operation,
  operand: number,
  userId: string,
  username: string
): Promise<ICalculation> => {
  // Find parent calculation
  const parent = await Calculation.findById(parentId);

  if (!parent) {
    throw new NotFoundError('Parent calculation not found');
  }

  // Check depth limit
  if (parent.depth >= MAX_DEPTH) {
    throw new ValidationError(`Maximum depth of ${MAX_DEPTH} reached`);
  }

  // Validate operand is finite
  if (!Number.isFinite(operand)) {
    throw new ValidationError('Operand must be a finite number');
  }

  // Validate division by zero
  if (operation === 'divide' && operand === 0) {
    throw new ValidationError('Cannot divide by zero');
  }

  // Calculate result
  const result = calculate(parent.value, operation, operand);

  // Check result is finite
  if (!Number.isFinite(result)) {
    throw new ValidationError('Result is not a finite number');
  }

  // Create new calculation
  const calculation = await Calculation.create({
    authorId: userId,
    authorUsername: username,
    value: result,
    operation,
    operand,
    parentId: parent._id.toString(),
    rootId: parent.rootId,
    depth: parent.depth + 1,
    childCount: 0,
  });

  // Increment parent's child count
  parent.childCount += 1;
  await parent.save();

  console.log(
    `Operation added: ${parent.value} ${operation} ${operand} = ${result} by ${username} (${calculation._id})`
  );

  return calculation;
};


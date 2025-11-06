import mongoose, { Schema } from 'mongoose';
import { ICalculation, Operation } from '../types';

const calculationSchema = new Schema<ICalculation>(
  {
    authorId: {
      type: String,
      required: [true, 'Author ID is required'],
      ref: 'User',
    },
    authorUsername: {
      type: String,
      required: [true, 'Author username is required'],
    },
    value: {
      type: Number,
      required: [true, 'Value is required'],
    },
    operation: {
      type: String,
      required: [true, 'Operation is required'],
      enum: ['start', 'add', 'subtract', 'multiply', 'divide'] as Operation[],
    },
    operand: {
      type: Number,
      default: null,
    },
    parentId: {
      type: String,
      default: null,
      ref: 'Calculation',
    },
    rootId: {
      type: String,
      required: false, // Will be set after creation for root calculations
      ref: 'Calculation',
    },
    depth: {
      type: Number,
      required: [true, 'Depth is required'],
      default: 0,
      min: 0,
    },
    childCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for efficient queries
calculationSchema.index({ parentId: 1, createdAt: -1 });
calculationSchema.index({ rootId: 1 });
calculationSchema.index({ authorId: 1, createdAt: -1 });
calculationSchema.index({ depth: 1 });

// Virtual for id field
calculationSchema.virtual('id').get(function () {
  return this._id.toString();
});

// Include virtuals in JSON
calculationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    const { __v, ...rest } = ret;
    return rest;
  },
});

export const Calculation = mongoose.model<ICalculation>('Calculation', calculationSchema);


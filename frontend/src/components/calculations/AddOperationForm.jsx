import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { operationSchema } from '../../utils/validators';
import { addOperation } from '../../api/calculations';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';

export default function AddOperationForm({ parentId, onClose, onSuccess }) {
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(operationSchema),
    defaultValues: {
      operation: 'add',
    },
  });

  const onSubmit = async (data) => {
    if (!parentId) {
      setApiError('Invalid calculation ID. Please try again.');
      return;
    }

    setApiError('');
    setIsSubmitting(true);

    try {
      const response = await addOperation(parentId, data.operation, data.operand);
      onSuccess?.(response.calculation);
      onClose();
    } catch (error) {
      setApiError(error.message || 'Failed to add operation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ErrorMessage message={apiError} onDismiss={() => setApiError('')} />

      <div>
        <label htmlFor="operation" className="block text-sm font-medium text-gray-700 mb-1">
          Operation
        </label>
        <select
          id="operation"
          {...register('operation')}
          className={`input ${errors.operation ? 'border-red-500' : ''}`}
        >
          <option value="add">Add (+)</option>
          <option value="subtract">Subtract (−)</option>
          <option value="multiply">Multiply (×)</option>
          <option value="divide">Divide (÷)</option>
        </select>
        {errors.operation && (
          <p className="text-red-600 text-sm mt-1">{errors.operation.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="operand" className="block text-sm font-medium text-gray-700 mb-1">
          Operand
        </label>
        <input
          type="number"
          id="operand"
          step="any"
          {...register('operand', { valueAsNumber: true })}
          className={`input ${errors.operand ? 'border-red-500' : ''}`}
          placeholder="Enter a number"
        />
        {errors.operand && (
          <p className="text-red-600 text-sm mt-1">{errors.operand.message}</p>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" loading={isSubmitting} disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Adding...' : 'Add Operation'}
        </Button>
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}


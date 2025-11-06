import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { startingNumberSchema } from '../../utils/validators';
import { createStartingNumber } from '../../api/calculations';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';

export default function CreateStartingNumberForm({ onClose, onSuccess }) {
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(startingNumberSchema),
  });

  const onSubmit = async (data) => {
    setApiError('');
    setIsSubmitting(true);

    try {
      const response = await createStartingNumber(data.value);
      onSuccess?.(response.calculation);
      onClose();
      // Don't navigate - stay on homepage to see the new tree
    } catch (error) {
      setApiError(error.message || 'Failed to create starting number.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ErrorMessage message={apiError} onDismiss={() => setApiError('')} />

      <div>
        <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
          Starting Number
        </label>
        <input
          type="number"
          id="value"
          step="any"
          {...register('value', { valueAsNumber: true })}
          className={`input ${errors.value ? 'border-red-500' : ''}`}
          placeholder="Enter a number to start with"
        />
        {errors.value && (
          <p className="text-red-600 text-sm mt-1">{errors.value.message}</p>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" loading={isSubmitting} disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Creating...' : 'Create'}
        </Button>
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}


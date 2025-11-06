import { useNavigate } from 'react-router-dom';
import CalculationCard from './CalculationCard';
import { formatCalculation, formatRelativeTime } from '../../utils/formatters';
import { getCalculationId } from '../../utils/calculations';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';
import { Plus } from 'lucide-react';

export default function CalculationTree({ calculation, children, onAddOperation }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const calculationId = getCalculationId(calculation);

  return (
    <div className="space-y-6">
      {/* Current Calculation - Highlighted */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <div className="text-3xl font-bold text-gray-900 mb-3">
          {formatCalculation(calculation)}
        </div>
        <div className="text-sm text-gray-600 mb-4">
          by <span className="font-medium text-blue-600">@{calculation.authorUsername}</span>
          {' • '}
          {formatRelativeTime(calculation.createdAt)}
        </div>
        {isAuthenticated && calculationId && (
          <Button onClick={() => onAddOperation(calculationId)}>
            <Plus size={18} />
            Add Operation
          </Button>
        )}
      </div>

      {/* Children Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Direct Replies ({children.length})
        </h2>

        {children.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">
              No replies yet. Be the first to respond!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => {
              const childId = getCalculationId(child);
              return (
                <CalculationCard
                  key={childId}
                  calculation={child}
                  showViewReplies={true}
                  showActions={true}
                  onViewReplies={() => childId && navigate(`/tree/${childId}`)}
                  onAddOperation={() => childId && onAddOperation(childId)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


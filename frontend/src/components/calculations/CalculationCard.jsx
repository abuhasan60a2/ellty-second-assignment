import { MessageSquare, Plus } from 'lucide-react';
import { formatCalculation, formatRelativeTime } from '../../utils/formatters';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';

export default function CalculationCard({
  calculation,
  showViewTree = false,
  showViewReplies = false,
  showActions = true,
  onViewTree,
  onViewReplies,
  onAddOperation,
}) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="card">
      <div className="text-2xl font-bold text-gray-900 mb-2">
        {formatCalculation(calculation)}
      </div>

      <div className="text-sm text-gray-600 mb-3">
        by <span className="font-medium text-blue-600">@{calculation.authorUsername}</span>
        {' • '}
        {formatRelativeTime(calculation.createdAt)}
      </div>

      {calculation.childCount > 0 && (
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
          <MessageSquare size={16} />
          <span>{calculation.childCount} {calculation.childCount === 1 ? 'reply' : 'replies'}</span>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        {showViewTree && onViewTree && (
          <Button onClick={onViewTree}>
            View Tree →
          </Button>
        )}

        {showViewReplies && calculation.childCount > 0 && onViewReplies && (
          <Button onClick={onViewReplies}>
            View Replies ({calculation.childCount})
          </Button>
        )}

        {showActions && isAuthenticated && onAddOperation && (
          <Button variant="secondary" onClick={onAddOperation}>
            <Plus size={18} />
            Add Operation
          </Button>
        )}
      </div>
    </div>
  );
}


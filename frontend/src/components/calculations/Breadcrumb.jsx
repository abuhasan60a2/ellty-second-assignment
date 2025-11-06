import { useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { formatCalculation } from '../../utils/formatters';
import { getCalculationId } from '../../utils/calculations';

export default function Breadcrumb({ items }) {
  const navigate = useNavigate();

  if (!items || items.length === 0) return null;

  return (
    <nav className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
      <ol className="flex items-center flex-wrap gap-2">
        <li>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Home size={16} />
            <span className="font-medium">Home</span>
          </button>
        </li>

        {items.map((item, index) => {
          const itemId = getCalculationId(item);
          return (
            <li key={itemId || index} className="flex items-center gap-2">
              <ChevronRight size={16} className="text-gray-400" />
              <button
                onClick={() => itemId && navigate(`/tree/${itemId}`)}
                className={`transition-colors ${
                  index === items.length - 1
                    ? 'text-gray-900 font-semibold cursor-default'
                    : 'text-blue-600 hover:text-blue-700'
                }`}
                disabled={index === items.length - 1 || !itemId}
              >
                {formatCalculation(item)}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}


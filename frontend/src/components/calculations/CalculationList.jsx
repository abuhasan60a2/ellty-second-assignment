import { useNavigate } from 'react-router-dom';
import CalculationCard from './CalculationCard';
import { getCalculationId } from '../../utils/calculations';

export default function CalculationList({ calculations }) {
  const navigate = useNavigate();

  if (!calculations || calculations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          No calculations yet. Be the first to start one!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {calculations.map((calculation) => {
        const calculationId = getCalculationId(calculation);
        return (
          <CalculationCard
            key={calculationId}
            calculation={calculation}
            showViewTree={true}
            onViewTree={() => calculationId && navigate(`/tree/${calculationId}`)}
          />
        );
      })}
    </div>
  );
}


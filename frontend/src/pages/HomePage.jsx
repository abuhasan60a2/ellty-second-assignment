import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { getRootCalculations } from '../api/calculations';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import ErrorMessage from '../components/common/ErrorMessage';
import CalculationTreeView from '../components/calculations/CalculationTreeView';
import CreateStartingNumberForm from '../components/calculations/CreateStartingNumberForm';
import AddOperationForm from '../components/calculations/AddOperationForm';
import { getCalculationId } from '../utils/calculations';

export default function HomePage() {
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetCalculationId, setTargetCalculationId] = useState(null);
  const [treeUpdateTrigger, setTreeUpdateTrigger] = useState(0);
  const { isAuthenticated } = useAuth();

  const limit = 50;

  const fetchCalculations = async (currentSkip = 0, append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);

      const response = await getRootCalculations(limit, currentSkip);
      
      if (append) {
        setCalculations((prev) => [...prev, ...response.calculations]);
      } else {
        setCalculations(response.calculations);
      }

      setHasMore(response.calculations.length === limit);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load calculations.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchCalculations(0, false);
  }, []);

  const handleLoadMore = () => {
    const newSkip = skip + limit;
    setSkip(newSkip);
    fetchCalculations(newSkip, true);
  };

  const handleCreateSuccess = (newCalculation) => {
    // Add new calculation to the list and trigger tree refresh
    setCalculations((prev) => [newCalculation, ...prev]);
    // Increment trigger to refresh all trees (in case we want to show the new tree)
    setTreeUpdateTrigger((prev) => prev + 1);
  };

  const handleAddOperation = (calcId) => {
    if (!calcId) {
      setError('Invalid calculation ID. Please try again.');
      return;
    }
    setTargetCalculationId(calcId);
    setShowAddModal(true);
  };

  const handleOperationSuccess = () => {
    // Trigger tree refresh by incrementing the trigger
    setTreeUpdateTrigger((prev) => prev + 1);
    setShowAddModal(false);
    setTargetCalculationId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Calculation Trees</h1>
        <p className="text-gray-600 text-lg mb-6">
          Start a discussion with a number, or add operations to any node in the tree.
        </p>

        {isAuthenticated && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus size={20} />
            Create Starting Number
          </Button>
        )}
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      {/* Display root calculations with their full trees */}
      <div className="space-y-12">
        {calculations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No calculations yet. Be the first to start one!
            </p>
          </div>
        ) : (
          calculations.map((calculation) => {
            const calculationId = getCalculationId(calculation);
            return (
              <div key={calculationId} className="border-b border-gray-200 pb-12 last:border-b-0">
                <CalculationTreeView
                  rootCalculation={calculation}
                  onAddOperation={handleAddOperation}
                  onTreeUpdate={treeUpdateTrigger}
                />
              </div>
            );
          })
        )}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <Button
            onClick={handleLoadMore}
            loading={loadingMore}
            disabled={loadingMore}
            variant="secondary"
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}

      {/* Create Starting Number Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Starting Number"
      >
        <CreateStartingNumberForm
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      </Modal>

      {/* Add Operation Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setTargetCalculationId(null);
        }}
        title="Add Operation"
      >
        {targetCalculationId && (
          <AddOperationForm
            parentId={targetCalculationId}
            onClose={() => {
              setShowAddModal(false);
              setTargetCalculationId(null);
            }}
            onSuccess={handleOperationSuccess}
          />
        )}
      </Modal>
    </div>
  );
}

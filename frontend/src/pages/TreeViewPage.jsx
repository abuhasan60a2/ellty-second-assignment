import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCalculationWithChildren } from '../api/calculations';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Modal from '../components/common/Modal';
import Breadcrumb from '../components/calculations/Breadcrumb';
import CalculationTree from '../components/calculations/CalculationTree';
import AddOperationForm from '../components/calculations/AddOperationForm';

export default function TreeViewPage() {
  const { calculationId } = useParams();
  const [calculation, setCalculation] = useState(null);
  const [children, setChildren] = useState([]);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetCalculationId, setTargetCalculationId] = useState(null);

  const fetchCalculationData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getCalculationWithChildren(calculationId);
      setCalculation(response.calculation);
      setChildren(response.children);
      setBreadcrumb(response.breadcrumb);
    } catch (err) {
      setError(err.message || 'Failed to load calculation.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalculationData();
  }, [calculationId]);

  const handleAddOperation = (calcId) => {
    if (!calcId) {
      setError('Invalid calculation ID. Please try again.');
      return;
    }
    setTargetCalculationId(calcId);
    setShowAddModal(true);
  };

  const handleOperationSuccess = () => {
    // Refetch the current calculation data to show the new child
    fetchCalculationData();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <ErrorMessage message={error} />
        <div className="text-center py-8">
          <p className="text-gray-600">The calculation you&apos;re looking for could not be found.</p>
        </div>
      </div>
    );
  }

  if (!calculation) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Calculation not found.</p>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb items={breadcrumb} />
      
      <CalculationTree
        calculation={calculation}
        children={children}
        onAddOperation={handleAddOperation}
      />

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


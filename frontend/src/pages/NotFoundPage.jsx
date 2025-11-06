import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="flex justify-center mb-6">
        <AlertCircle className="text-gray-400" size={80} />
      </div>
      
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
      
      <p className="text-gray-600 text-lg mb-8">
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <Link to="/">
        <Button>
          <Home size={20} />
          Back to Home
        </Button>
      </Link>
    </div>
  );
}


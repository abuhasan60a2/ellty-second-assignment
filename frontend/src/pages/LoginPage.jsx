import { LogIn } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center mb-6">
          <LogIn className="text-blue-600" size={48} />
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Login</h1>
        <p className="text-center text-gray-600 mb-6">
          Welcome back! Please login to your account.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}


import { UserPlus } from 'lucide-react';
import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center mb-6">
          <UserPlus className="text-blue-600" size={48} />
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Register</h1>
        <p className="text-center text-gray-600 mb-6">
          Create your account to start calculating!
        </p>
        <RegisterForm />
      </div>
    </div>
  );
}


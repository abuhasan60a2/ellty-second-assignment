import { Link } from 'react-router-dom';
import { Calculator, LogOut, LogIn, UserPlus } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
        <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
          <Calculator size={28} />
          <span className="text-xl font-bold">Calculation Tree</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-gray-700 font-medium">
                Welcome, <span className="text-blue-600">{user.username}</span>
              </span>
              <Button variant="secondary" onClick={logout}>
                <LogOut size={18} />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary">
                  <LogIn size={18} />
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">
                  <UserPlus size={18} />
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}


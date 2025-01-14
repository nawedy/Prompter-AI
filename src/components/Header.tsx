import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, User, LogOut } from 'lucide-react';
import { useUserStore } from '../store/userStore';

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useUserStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-primary-dark border-b border-secondary-light/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary-DEFAULT" />
            <span className="text-xl font-bold text-white">Prompter.AI</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-white/80 hover:text-white"
                >
                  Dashboard
                </Link>
                <Link
                  to="/templates"
                  className="text-white/80 hover:text-white"
                >
                  Templates
                </Link>
                <Link
                  to="/settings"
                  className="text-white/80 hover:text-white"
                >
                  Settings
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/features"
                  className="text-white/80 hover:text-white"
                >
                  Features
                </Link>
                <Link
                  to="/pricing"
                  className="text-white/80 hover:text-white"
                >
                  Pricing
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary-light/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-light" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-white">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-white/80 hover:text-white"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white/80 hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-dark bg-primary-DEFAULT hover:bg-primary-light"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
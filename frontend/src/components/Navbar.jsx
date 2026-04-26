import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, ShoppingCart, LogOut, UserCircle } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };

  const getDashboardLink = () => {
    if (user?.role === 'ADMIN') return '/admin-dashboard';
    if (user?.role === 'RESTAURANT') return '/restaurant-dashboard';
    if (user?.role === 'DELIVERY') return '/delivery-dashboard';
    if (user?.role === 'CUSTOMER') return '/orders';
    return '/';
  };

  return (
    <nav className="bg-surface border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <UtensilsCrossed className="w-8 h-8 text-primary" />
          <span className="text-textPrimary bg-clip-text">FoodHub</span>
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              {user.role === 'CUSTOMER' && (
                <Link to="/cart" className="flex items-center gap-2 text-textSecondary hover:text-primary transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-medium">Cart</span>
                </Link>
              )}
              <Link to={getDashboardLink()} className="text-textSecondary hover:text-primary transition-colors pr-4 border-r border-gray-200">
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-textSecondary hover:text-danger transition-colors font-medium"
              >
                <UserCircle className="w-5 h-5" />
                {user.name} <LogOut className="w-4 h-4 ml-1" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-textSecondary hover:text-primary font-medium">Sign In</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

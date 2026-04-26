import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantDashboard from './pages/RestaurantDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import Orders from './pages/Orders';
import { Toaster } from 'react-hot-toast';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  
  return children;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-textPrimary leading-normal">
        <Toaster position="top-center" toastOptions={{ duration: 3000, style: { background: '#333', color: '#fff', borderRadius: '12px' } }} />
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={
              <ProtectedRoute roles={['CUSTOMER']}>
                <Cart />
              </ProtectedRoute>
            } />
            <Route path="/checkout/:restaurantId" element={
              <ProtectedRoute roles={['CUSTOMER']}>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/payment-success" element={
              <ProtectedRoute roles={['CUSTOMER']}>
                <PaymentSuccess />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute roles={['CUSTOMER']}>
                <Orders />
              </ProtectedRoute>
            } />

            <Route path="/restaurant-dashboard" element={
              <ProtectedRoute roles={['RESTAURANT']}>
                <RestaurantDashboard />
              </ProtectedRoute>
            } />

            <Route path="/delivery-dashboard" element={
              <ProtectedRoute roles={['DELIVERY']}>
                <DeliveryDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

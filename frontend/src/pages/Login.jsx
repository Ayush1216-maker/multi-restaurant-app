import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'RESTAURANT') navigate('/restaurant-dashboard');
      else if (user.role === 'DELIVERY') navigate('/delivery-dashboard');
      else navigate('/');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] -mt-8 -mx-4">
      {/* Left side - Image Banner */}
      <div className="hidden lg:block lg:w-1/2 relative bg-surfaceDark overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=1000&auto=format&fit=crop" 
          alt="Delicious food" 
          className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute bottom-16 left-16 right-16 text-white text-left">
          <span className="inline-block px-3 py-1 bg-primary/20 backdrop-blur-sm text-primary font-bold text-xs rounded-full border border-primary/30 mb-4 tracking-wider uppercase">Welcome Back</span>
          <h2 className="text-5xl font-black mb-6 leading-tight">Your cravings, <br/>delivered fast.</h2>
          <p className="text-gray-300 text-lg font-medium max-w-md">Sign in to access your saved addresses, track your orders, and enjoy exclusive discounts from top restaurants.</p>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-textPrimary tracking-tight mb-3">Sign In to FoodHub</h1>
            <p className="text-textSecondary text-lg">Enter your details to get started</p>
          </div>
  
          <div className="bg-surface p-8 sm:p-10 rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-gray-100">
            {error && <div className="bg-danger/10 text-danger p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-2 border border-danger/20">⚠ {error}</div>}
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-bold text-textPrimary mb-2 ml-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field py-3 rounded-xl bg-gray-50 focus:bg-white"
                  placeholder="name@example.com"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-textPrimary mb-2 ml-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field py-3 rounded-xl bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button type="submit" className="btn-primary mt-2 py-3.5 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">Sign In Securely</button>
            </form>
  
            <p className="mt-8 text-center text-textSecondary font-medium">
              Don't have an account? <Link to="/register" className="text-primary hover:text-primaryHover hover:underline font-bold transition-colors">Create one now</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

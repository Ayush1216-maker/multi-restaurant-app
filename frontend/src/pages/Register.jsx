import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER'
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(formData.name, formData.email, formData.password, formData.role);
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'RESTAURANT') navigate('/restaurant-dashboard');
      else if (user.role === 'DELIVERY') navigate('/delivery-dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try using a different email.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] -mt-8 -mx-4">
      {/* Left side - Image Banner */}
      <div className="hidden lg:block lg:w-1/2 relative bg-surfaceDark overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1000&auto=format&fit=crop" 
          alt="Delicious food collection" 
          className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute bottom-16 left-16 right-16 text-white text-left">
          <span className="inline-block px-3 py-1 bg-primary/20 backdrop-blur-sm text-primary font-bold text-xs rounded-full border border-primary/30 mb-4 tracking-wider uppercase">Join the community</span>
          <h2 className="text-5xl font-black mb-6 leading-tight">Start your food <br/>journey today.</h2>
          <p className="text-gray-300 text-lg font-medium max-w-md">Discover new tastes, support local restaurants, and get exactly what you're craving delivered straight to your door.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-textPrimary tracking-tight mb-3">Create Account</h1>
            <p className="text-textSecondary text-lg">Join us and start exploring!</p>
          </div>
  
          <div className="bg-surface p-8 sm:p-10 rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-gray-100">
            {error && <div className="bg-danger/10 text-danger p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-2 border border-danger/20">⚠ {error}</div>}
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-bold text-textPrimary mb-2 ml-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field py-3 rounded-xl bg-gray-50 focus:bg-white"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-textPrimary mb-2 ml-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="input-field py-3 rounded-xl bg-gray-50 focus:bg-white"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-textPrimary mb-2 ml-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="input-field py-3 rounded-xl bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-textPrimary mb-2 ml-1">Account Type</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="input-field py-3 rounded-xl bg-gray-50 focus:bg-white font-medium cursor-pointer"
                >
                  <option value="CUSTOMER">Customer (Order Food)</option>
                  <option value="RESTAURANT">Restaurant Owner</option>
                  <option value="DELIVERY">Delivery Partner</option>
                </select>
              </div>
              <button type="submit" className="btn-primary mt-4 py-3.5 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">Create Account</button>
            </form>
  
            <p className="mt-8 text-center text-textSecondary font-medium">
              Already have an account? <Link to="/login" className="text-primary hover:text-primaryHover hover:underline font-bold transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

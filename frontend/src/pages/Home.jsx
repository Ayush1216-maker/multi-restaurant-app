import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Search, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Home() {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await api.get('/foods');
      setFoods(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = async (food) => {
    setAddingToCart(food.id);
    try {
      if (!user) {
        toast.error('Please login to add items to cart!');
        return;
      }
      await api.post('/cart', {
        userId: user.id,
        foodId: food.id,
        quantity: 1
      });
      toast.success(`${food.name} added to your cart!`, {
        icon: '🍱',
      });
    } catch (err) {
      console.error(err);
      toast.error(`Failed to add ${food.name} to cart`);
    } finally {
      setAddingToCart(null);
    }
  };

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name ? food.name.toLowerCase().includes(search.toLowerCase()) : false;
    const matchesCategory = selectedCategory === 'ALL' || (food.categoryId && food.categoryId.toString() === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-10">
      {/* Premium Hero Banner Section */}
      <div className="relative rounded-3xl p-10 md:p-16 shadow-2xl overflow-hidden group">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-surfaceDark via-surfaceDark/90 to-transparent"></div>
        
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary font-bold text-sm tracking-wide mb-6 uppercase border border-primary/30">
            100% Fresh & Fast
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white leading-tight tracking-tight">
            Super Delicious Food <br/> <span className="text-primary">Delivered Fast.</span>
          </h1>
          <p className="text-gray-300 mb-10 text-lg border-l-4 border-primary pl-5">Discover the best food & drinks from top-rated restaurants around you. Order now for 50% off on your first delivery!</p>
          
          <div className="relative w-full max-w-md shadow-2xl shadow-primary/10">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search delicious food..." 
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-300 rounded-full pl-14 pr-6 py-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 backdrop-blur-md transition-all font-medium text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="px-2">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-textPrimary tracking-tight">Explore Categories</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
          <button 
            onClick={() => setSelectedCategory('ALL')}
            className={`snap-start px-8 py-3 rounded-2xl font-bold whitespace-nowrap transition-all duration-300 ${selectedCategory === 'ALL' ? 'bg-primary text-white shadow-xl shadow-primary/30 -translate-y-1' : 'bg-surface text-textSecondary hover:bg-gray-100 hover:-translate-y-0.5 border border-gray-200'}`}
          >
            All Foods
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id.toString())}
              className={`snap-start px-8 py-3 rounded-2xl font-bold whitespace-nowrap transition-all duration-300 ${selectedCategory === cat.id.toString() ? 'bg-primary text-white shadow-xl shadow-primary/30 -translate-y-1' : 'bg-surface text-textSecondary hover:bg-gray-100 hover:-translate-y-0.5 border border-gray-200'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-2">
        {filteredFoods.map((food, index) => (
          <div key={food.id} className="card p-0 rounded-3xl overflow-hidden flex flex-col hover:-translate-y-2 hover:shadow-2xl hover:shadow-gray-200 transition-all duration-300 group border-0 bg-surface">
            <div className="h-48 relative overflow-hidden">
              <img 
                src={`https://images.unsplash.com/photo-${index % 2 === 0 ? '1546069901-ba9599a7e63c' : '1568901346375-23c9450c58cd'}?w=500&auto=format&fit=crop`} 
                alt={food.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-textPrimary text-xs font-black px-4 py-1.5 rounded-full shadow-lg border border-gray-100 uppercase tracking-wider">{food.categoryName}</span>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="text-xl font-bold text-textPrimary line-clamp-1">{food.name}</h3>
                <span className="text-sm rounded-full bg-green-100 text-green-700 font-bold px-2 py-0.5 flex items-center gap-1">★ 4.8</span>
              </div>
              <p className="text-textSecondary text-sm mb-5 font-medium line-clamp-1 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span> By {food.restaurantName}</p>
              
              <div className="mt-auto flex justify-between items-center pt-5 border-t border-gray-100">
                <span className="text-2xl font-black text-textPrimary">${food.price.toFixed(2)}</span>
                <button 
                  onClick={() => addToCart(food)}
                  disabled={addingToCart === food.id}
                  className="btn-primary flex items-center justify-center gap-2 rounded-2xl px-6 py-2.5 shadow-lg shadow-primary/20 hover:shadow-primary/40 focus:ring-4 focus:ring-primary/20"
                >
                  {addingToCart === food.id ? '...' : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredFoods.length === 0 && (
          <div className="col-span-full py-12 text-center text-textSecondary">
            No foods found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}

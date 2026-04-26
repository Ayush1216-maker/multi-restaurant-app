import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Store, Plus, Utensils, Package, Truck, Edit } from 'lucide-react';

export default function RestaurantDashboard() {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deliveries, setDeliveries] = useState([]); // List of delivery partners
  const [loading, setLoading] = useState(true);

  // Forms states
  const [showRForm, setShowRForm] = useState(false);
  const [rName, setRName] = useState('');
  
  const [showFForm, setShowFForm] = useState(false);
  const [fName, setFName] = useState('');
  const [fPrice, setFPrice] = useState('');
  const [fCategoryId, setFCategoryId] = useState('');

  useEffect(() => {
    fetchInitData();
  }, []);

  const fetchInitData = async () => {
    try {
      // fetch categories
      const catRes = await api.get('/categories');
      setCategories(catRes.data);
      if(catRes.data.length > 0) setFCategoryId(catRes.data[0].id.toString());

      // fetch restaurant
      const res = await api.get(`/restaurants/owner/${user.id}`);
      if (res.data) {
        setRestaurant(res.data);
        fetchFoods(res.data.id);
        fetchOrders(res.data.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFoods = async (rId) => {
    const res = await api.get(`/foods/restaurant/${rId}`);
    setFoods(res.data);
  };

  const fetchOrders = async (rId) => {
    const res = await api.get(`/orders/restaurant/${rId}`);
    setOrders(res.data.sort((a, b) => b.id - a.id));
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/restaurants', { name: rName, ownerId: user.id });
      setRestaurant(res.data);
      setShowRForm(false);
    } catch (err) {
      alert('Failed to create restaurant');
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      await api.post('/foods', {
        name: fName,
        price: parseFloat(fPrice),
        categoryId: parseInt(fCategoryId),
        restaurantId: restaurant.id
      });
      setShowFForm(false);
      setFName(''); setFPrice('');
      fetchFoods(restaurant.id);
    } catch (err) {
      alert('Failed to add food');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status?status=${newStatus}`);
      fetchOrders(restaurant.id);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const assignDelivery = async (orderId) => {
    const personId = prompt("Enter Delivery Person ID (Ideally this would be a dropdown of available partners):");
    if(!personId) return;
    try {
      await api.post(`/deliveries/assign?orderId=${orderId}&deliveryPersonId=${personId}`);
      alert("Assigned successfully");
      fetchOrders(restaurant.id);
    } catch(err) {
      alert("Failed to assign. Check if ID belongs to a valid Delivery Person.");
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!restaurant) {
    return (
      <div className="max-w-md mx-auto card text-center p-8 mt-12">
        <Store className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold mb-2">Welcome, Partner!</h2>
        <p className="text-textSecondary mb-6">Let's set up your restaurant first to start selling foods.</p>
        
        {!showRForm ? (
          <button onClick={() => setShowRForm(true)} className="btn-primary">Create Your Restaurant</button>
        ) : (
          <form onSubmit={handleCreateRestaurant} className="flex flex-col gap-4 text-left">
            <div>
              <label className="block text-sm mb-1 text-textSecondary">Restaurant Name</label>
              <input type="text" value={rName} onChange={e => setRName(e.target.value)} required className="input-field" />
            </div>
            <button type="submit" className="btn-primary">Submit</button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center bg-surface p-6 rounded-2xl shadow-lg border border-white/5">
        <div className="flex items-center gap-4">
          <div className="bg-primary/20 p-3 rounded-xl text-primary">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{restaurant.name}</h1>
            <p className="text-textSecondary">Restaurant Dashboard</p>
          </div>
        </div>
        {categories.length > 0 ? (
          <button onClick={() => setShowFForm(!showFForm)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Food Item
          </button>
        ) : (
          <p className="text-amber-400 text-sm">Waiting for Admin to add Categories...</p>
        )}
      </div>

      {showFForm && categories.length > 0 && (
        <div className="card max-w-2xl">
          <h3 className="text-xl font-bold mb-4">Add New Food Item</h3>
          <form onSubmit={handleAddFood} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-textSecondary">Food Name</label>
              <input type="text" value={fName} onChange={e => setFName(e.target.value)} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm mb-1 text-textSecondary">Price ($)</label>
              <input type="number" step="0.01" value={fPrice} onChange={e => setFPrice(e.target.value)} required className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1 text-textSecondary">Category</label>
              <select value={fCategoryId} onChange={e => setFCategoryId(e.target.value)} className="input-field">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end gap-2 mt-2">
              <button type="button" onClick={() => setShowFForm(false)} className="px-4 py-2 text-textSecondary hover:text-white transition-colors">Cancel</button>
              <button type="submit" className="btn-primary">Add Food</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Utensils className="w-6 h-6 text-accent" />
            <h2 className="text-xl font-bold">Your Menu</h2>
          </div>
          <div className="flex flex-col gap-4">
            {foods.length === 0 ? <div className="card text-textSecondary">No foods added yet.</div> : foods.map(food => (
              <div key={food.id} className="card p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-bold">{food.name}</h4>
                  <p className="text-sm text-textSecondary">{food.categoryName}</p>
                </div>
                <div className="font-bold text-accent">${food.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">Recent Orders</h2>
          </div>
          <div className="flex flex-col gap-4">
            {orders.length === 0 ? <div className="card text-textSecondary">No orders yet.</div> : orders.map(order => (
              <div key={order.id} className="card p-4">
                <div className="flex justify-between mb-2">
                  <span className="font-bold">Order #{order.id}</span>
                  <span className="bg-slate-700 px-2 py-1 rounded text-xs">{order.status}</span>
                </div>
                <div className="text-sm text-textSecondary mb-4">
                  Customer: {order.userName} <br/>
                  Total: ${order.totalAmount.toFixed(2)}
                </div>
                <div className="flex flex-wrap gap-2">
                  {order.status === 'PLACED' && (
                    <button onClick={() => updateOrderStatus(order.id, 'PREPARING')} className="btn-primary text-xs py-1">Prepare</button>
                  )}
                  {order.status === 'PREPARING' && (
                    <button onClick={() => assignDelivery(order.id)} className="bg-purple-600 hover:bg-purple-500 text-white font-medium py-1 px-3 rounded-lg text-xs transition-colors flex items-center gap-1">
                      <Truck className="w-3 h-3" /> Assign Delivery
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

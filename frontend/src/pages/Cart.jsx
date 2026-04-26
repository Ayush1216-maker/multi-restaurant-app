import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get(`/cart/user/${user.id}`);
      setCartItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await api.put(`/cart/${id}?quantity=${newQuantity}`);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) return;
    
    // Group items by restaurant to place separate orders if needed, 
    // but the backend logic expects a specific restaurantId. Let's just group by the first item's restaurant since 
    // we need to place orders per restaurant. Let's fetch food details if we don't have restaurantId in cart item.
    // Our backend expects /api/orders/place/{userId}/{restaurantId}
    
    // Quick hack for this interface: CartItemDTO doesn't have restaurantId, 
    // let's fetch food to know the restaurant or assume order is valid.
    // Wait, let's get the restaurant id.
    
    setPlacingOrder(true);
    try {
      // Find all unique food items and get their restaurantIds.
      // This requires grabbing the backend foods.
        const foodsRes = await api.get('/foods');
      const allFoods = foodsRes.data;
      
      const cartFoodDetails = cartItems.map(item => allFoods.find(f => f.id === item.foodId));
      const restaurantIds = [...new Set(cartFoodDetails.map(f => f.restaurantId))];
      
      if (restaurantIds.length > 0) {
        // Navigate to payment page for the first restaurant in cart
        navigate(`/checkout/${restaurantIds[0]}`);
      } else {
        alert('Could not determine restaurant for your items.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to proceed to checkout. ' + (err.response?.data?.message || ''));
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Your Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="card text-center py-16">
          <ShoppingCart className="w-16 h-16 text-textSecondary mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-textSecondary mb-6">Looks like you haven't added anything yet.</p>
          <button onClick={() => navigate('/')} className="btn-primary">Browse Foods</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 flex flex-col gap-4">
            {cartItems.map(item => (
              <div key={item.id} className="card flex items-center justify-between p-4">
                <div>
                  <h3 className="font-bold text-lg">{item.foodName}</h3>
                  <p className="text-accent font-medium">${item.foodPrice.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 bg-slate-800 rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded bg-slate-700 hover:bg-slate-600 transition-colors"
                    >-</button>
                    <span className="w-6 text-center font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded bg-slate-700 hover:bg-slate-600 transition-colors"
                    >+</button>
                  </div>
                  <div className="w-20 text-right font-bold">
                    ${item.totalPrice.toFixed(2)}
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-danger hover:bg-danger/10 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div>
            <div className="card sticky top-24">
              <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-4">Order Summary</h3>
              <div className="flex justify-between mb-2 text-textSecondary">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4 text-textSecondary">
                <span>Delivery Fee</span>
                <span>$5.00</span>
              </div>
              <div className="flex justify-between font-bold text-xl mb-6 pt-4 border-t border-white/10">
                <span>Total</span>
                <span className="text-primary">${(total + 5).toFixed(2)}</span>
              </div>
              <button 
                onClick={placeOrder}
                disabled={placingOrder}
                className="btn-primary w-full flex justify-center items-center gap-2 py-3"
              >
                {placingOrder ? 'Processing...' : 'Checkout'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

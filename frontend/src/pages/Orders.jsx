import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Package, Clock, CheckCircle, Truck } from 'lucide-react';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/orders/user/${user.id}`);
      setOrders(res.data.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch(status) {
      case 'PLACED': return { color: 'text-blue-400 bg-blue-400/10', icon: Package, text: 'Order Placed' };
      case 'PREPARING': return { color: 'text-amber-400 bg-amber-400/10', icon: Clock, text: 'Preparing' };
      case 'OUT_FOR_DELIVERY': return { color: 'text-purple-400 bg-purple-400/10', icon: Truck, text: 'Out for Delivery' };
      case 'DELIVERED': return { color: 'text-emerald-400 bg-emerald-400/10', icon: CheckCircle, text: 'Delivered' };
      default: return { color: 'text-slate-400 bg-slate-400/10', icon: Package, text: status };
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="card text-center py-16 text-textSecondary">
          <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map(order => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div key={order.id} className="card p-0 overflow-hidden">
                <div className="bg-slate-800/50 p-4 border-b border-white/5 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-sm text-textSecondary">Order #{order.id}</p>
                    <h3 className="font-bold">{order.restaurantName}</h3>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.color}`}>
                    <StatusIcon className="w-4 h-4" />
                    {statusConfig.text}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex flex-col gap-3 mb-4">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <span className="bg-slate-800 w-6 h-6 flex items-center justify-center rounded text-xs font-bold">
                            {item.quantity}x
                          </span>
                          <span>{item.foodName}</span>
                        </div>
                        <span className="text-textSecondary">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-white/10 font-bold">
                    <span>Total Amount</span>
                    <span className="text-primary text-xl">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

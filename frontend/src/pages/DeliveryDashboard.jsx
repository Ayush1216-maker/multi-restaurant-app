import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Truck, MapPin, CheckCircle } from 'lucide-react';

export default function DeliveryDashboard() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const res = await api.get(`/deliveries/person/${user.id}`);
      setDeliveries(res.data.sort((a,b) => b.id - a.id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/deliveries/${id}/status?status=${status}`);
      fetchDeliveries();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8 bg-surface p-6 rounded-2xl shadow-lg border border-white/5">
        <div className="bg-purple-500/20 p-4 rounded-xl text-purple-400">
          <Truck className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Delivery Partner Dashboard</h1>
          <p className="text-textSecondary">Your ID is: <span className="font-mono text-white bg-slate-800 px-2 rounded">{user.id}</span> (Share this with restaurants)</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {deliveries.length === 0 ? (
          <div className="card text-center py-12 text-textSecondary">No deliveries assigned to you yet.</div>
        ) : (
          deliveries.map(d => (
            <div key={d.id} className="card flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="w-full md:w-auto">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-purple-600 px-2 py-1 rounded text-xs font-bold text-white">Delivery #{d.id}</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    d.status === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {d.status}
                  </span>
                </div>
                <p className="text-sm text-textSecondary flex items-center gap-1 mt-2">
                  <MapPin className="w-4 h-4" /> Linked Order #{d.orderId}
                </p>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                {d.status === 'PENDING' && (
                  <button onClick={() => updateStatus(d.id, 'PICKED_UP')} className="btn-primary w-full md:w-auto text-sm">
                    Mark Picked Up
                  </button>
                )}
                {d.status === 'PICKED_UP' && (
                  <button onClick={() => updateStatus(d.id, 'DELIVERED')} className="bg-emerald-600 hover:bg-emerald-500 text-white transition-colors px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 w-full md:w-auto text-sm">
                    <CheckCircle className="w-4 h-4" /> Mark Delivered
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

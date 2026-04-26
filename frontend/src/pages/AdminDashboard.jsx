import { useState, useEffect } from 'react';
import api from '../services/api';
import { Tag, Plus, Trash2, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch(err) {
      console.error(err);
    }
  }

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name });
      setName('');
      fetchCategories();
    } catch(err) {
      alert('Failed to add. Maybe duplicate?');
    }
  }

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch(err) {
      alert('Failed to delete. It might be used by existing foods.');
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8 bg-surface p-6 rounded-2xl shadow-lg border border-white/5">
        <div className="bg-red-500/20 p-4 rounded-xl text-red-400">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-textSecondary">Manage system configurations</p>
        </div>
      </div>

      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-primary" />
          Food Categories
        </h2>
        
        <form onSubmit={addCategory} className="flex gap-4 mb-6">
          <input 
            type="text" 
            value={name} 
            onChange={e=>setName(e.target.value)} 
            placeholder="New category name" 
            className="input-field flex-1"
            required
          />
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>

        <div className="flex flex-col gap-2">
          {categories.map(c => (
            <div key={c.id} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-white/5">
              <span>{c.name}</span>
              <button onClick={() => deleteCategory(c.id)} className="text-danger hover:bg-danger/10 p-2 rounded transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { useToast } from '@/hooks/use-toast';
import { MenuItem } from '@/types/menu';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';

const categoryOptions = ['momo', 'rice', 'curry', 'snacks', 'drinks'];

const ProductsTab = () => {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useAdminStore();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('momo');
  const [formPrice, setFormPrice] = useState('');
  const [formRating, setFormRating] = useState('4.5');
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formBadge, setFormBadge] = useState('');

  const filtered = search ? menuItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase())) : menuItems;

  const resetForm = () => {
    setFormName(''); setFormCategory('momo'); setFormPrice(''); setFormRating('4.5'); setFormDesc(''); setFormImage(''); setFormBadge('');
    setEditingId(null); setShowForm(false);
  };

  const startEdit = (item: MenuItem) => {
    setFormName(item.name); setFormCategory(item.category); setFormPrice(String(item.price));
    setFormRating(String(item.rating)); setFormDesc(item.description); setFormImage(item.image);
    setFormBadge(item.badge || ''); setEditingId(item.id); setShowForm(true);
  };

  const handleSave = () => {
    if (!formName || !formPrice) return;
    const data = {
      name: formName, category: formCategory, price: parseInt(formPrice), rating: parseFloat(formRating),
      description: formDesc, image: formImage || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
      badge: formBadge || undefined, isAvailable: true, isFeatured: false,
    };
    if (editingId) {
      updateMenuItem(editingId, data);
      toast({ title: '✅ Item updated!' });
    } else {
      addMenuItem({ ...data, id: Date.now().toString() } as MenuItem);
      toast({ title: '✅ Item added!' });
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteMenuItem(id);
    setConfirmDelete(null);
    toast({ title: '🗑️ Item deleted' });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl font-bold text-admin-text">{menuItems.length} Menu Items</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-admin-accent text-white font-body text-sm font-semibold hover:brightness-110 transition">
          <Plus className="w-4 h-4" /> Add New Item
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-admin-card rounded-xl border border-admin-border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-admin-text">{editingId ? `Edit: ${formName}` : 'Add New Menu Item'}</h2>
            <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-admin-bg text-admin-muted"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Item Name" className="px-4 py-2.5 rounded-lg border border-admin-border bg-admin-bg text-admin-text font-body text-sm outline-none focus:ring-1 focus:ring-admin-accent" />
            <select value={formCategory} onChange={e => setFormCategory(e.target.value)} className="px-4 py-2.5 rounded-lg border border-admin-border bg-admin-bg text-admin-text font-body text-sm outline-none focus:ring-1 focus:ring-admin-accent capitalize">
              {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input value={formPrice} onChange={e => setFormPrice(e.target.value)} type="number" placeholder="Price (Rs.)" className="px-4 py-2.5 rounded-lg border border-admin-border bg-admin-bg text-admin-text font-body text-sm outline-none focus:ring-1 focus:ring-admin-accent" />
            <input value={formRating} onChange={e => setFormRating(e.target.value)} type="number" step="0.1" min="1" max="5" placeholder="Rating" className="px-4 py-2.5 rounded-lg border border-admin-border bg-admin-bg text-admin-text font-body text-sm outline-none focus:ring-1 focus:ring-admin-accent" />
            <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="Description" rows={2} className="md:col-span-2 px-4 py-2.5 rounded-lg border border-admin-border bg-admin-bg text-admin-text font-body text-sm outline-none focus:ring-1 focus:ring-admin-accent resize-none" />
            <input value={formImage} onChange={e => setFormImage(e.target.value)} placeholder="Image URL (Unsplash or any)" className="md:col-span-2 px-4 py-2.5 rounded-lg border border-admin-border bg-admin-bg text-admin-text font-body text-sm outline-none focus:ring-1 focus:ring-admin-accent" />
            <input value={formBadge} onChange={e => setFormBadge(e.target.value)} placeholder="Badge (optional: Bestseller, New, Spicy 🌶️)" className="px-4 py-2.5 rounded-lg border border-admin-border bg-admin-bg text-admin-text font-body text-sm outline-none focus:ring-1 focus:ring-admin-accent" />
            <button onClick={handleSave} className="px-6 py-2.5 rounded-lg bg-admin-accent text-white font-body text-sm font-semibold hover:brightness-110 transition">
              {editingId ? 'Update Item' : 'Save Item'}
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-admin-border bg-admin-bg text-admin-text font-body text-sm outline-none focus:ring-1 focus:ring-admin-accent" />
      </div>

      {/* Table */}
      <div className="bg-admin-card rounded-xl border border-admin-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-admin-border">
                <th className="px-4 py-3 font-body text-xs text-admin-muted font-medium">Image</th>
                <th className="px-4 py-3 font-body text-xs text-admin-muted font-medium">Name</th>
                <th className="px-4 py-3 font-body text-xs text-admin-muted font-medium">Category</th>
                <th className="px-4 py-3 font-body text-xs text-admin-muted font-medium">Price</th>
                <th className="px-4 py-3 font-body text-xs text-admin-muted font-medium">Rating</th>
                <th className="px-4 py-3 font-body text-xs text-admin-muted font-medium">Badge</th>
                <th className="px-4 py-3 font-body text-xs text-admin-muted font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} className="border-b border-admin-border/50 hover:bg-admin-bg/30 transition-colors">
                  <td className="px-4 py-3"><img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} /></td>
                  <td className="px-4 py-3 font-body text-sm text-admin-text font-medium">{item.name}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-admin-accent/10 text-admin-accent font-body text-xs capitalize">{item.category}</span></td>
                  <td className="px-4 py-3 font-body text-sm text-admin-text">Rs. {item.price}</td>
                  <td className="px-4 py-3 font-body text-sm text-admin-text">⭐ {item.rating}</td>
                  <td className="px-4 py-3 font-body text-xs text-admin-muted">{item.badge || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEdit(item)} className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors"><Pencil className="w-4 h-4" /></button>
                      {confirmDelete === item.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(item.id)} className="px-2 py-1 rounded-lg bg-red-500/20 text-red-400 font-body text-xs font-semibold">Yes</button>
                          <button onClick={() => setConfirmDelete(null)} className="px-2 py-1 rounded-lg bg-admin-bg text-admin-muted font-body text-xs">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsTab;

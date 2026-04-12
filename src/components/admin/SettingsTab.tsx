import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const SettingsTab = () => {
  const { toast } = useToast();
  const [name, setName] = useState('Kaushi Restaurant');
  const [phone, setPhone] = useState('+977 98-0000-0000');
  const [address, setAddress] = useState('Baglung Bazaar, Baglung, Nepal');
  const [hours, setHours] = useState('8:00 AM – 9:00 PM');

  const handleSave = () => {
    toast({ title: '✅ Settings saved!' });
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-admin-text mb-6">Settings</h1>
      <div className="bg-admin-card rounded-xl border border-admin-border p-6 max-w-2xl space-y-4">
        <div>
          <label className="block font-body text-sm text-admin-muted mb-1">Restaurant Name</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-admin-border bg-admin-bg text-admin-text font-body text-sm outline-none focus:ring-1 focus:ring-admin-accent" />
        </div>
        <div>
          <label className="block font-body text-sm text-admin-muted mb-1">Phone</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-admin-border bg-admin-bg text-admin-text font-body text-sm outline-none focus:ring-1 focus:ring-admin-accent" />
        </div>
        <div>
          <label className="block font-body text-sm text-admin-muted mb-1">Address</label>
          <input value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-admin-border bg-admin-bg text-admin-text font-body text-sm outline-none focus:ring-1 focus:ring-admin-accent" />
        </div>
        <div>
          <label className="block font-body text-sm text-admin-muted mb-1">Opening Hours</label>
          <input value={hours} onChange={e => setHours(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-admin-border bg-admin-bg text-admin-text font-body text-sm outline-none focus:ring-1 focus:ring-admin-accent" />
        </div>
        <button onClick={handleSave} className="px-6 py-2.5 rounded-lg bg-admin-accent text-white font-body text-sm font-semibold hover:brightness-110 transition">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsTab;

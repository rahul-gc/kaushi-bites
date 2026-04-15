import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, X, Loader2 } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

const AdminLoginModal = () => {
  const { isAdminLoginOpen, setAdminLoginOpen, loginAdmin, isLoading, error: storeError } = useAdminStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = await loginAdmin(username, password);
    if (!ok) {
      setError(storeError || 'Invalid credentials.');
      setPassword('');
    }
  };

  return (
    <AnimatePresence>
      {isAdminLoginOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-[rgba(15,23,42,0.96)] backdrop-blur-md" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          >
            <div className="w-full max-w-sm bg-admin-sidebar rounded-2xl border border-admin-accent/30 shadow-2xl overflow-hidden">
              <div className="p-8 text-center">
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="font-display text-xl font-bold text-admin-text">Admin Access</h3>
                <p className="font-body text-sm text-admin-muted mt-1">Restricted — Kaushi Restaurant</p>
              </div>

              <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
                  <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-admin-border bg-admin-bg text-admin-text font-body text-sm focus:ring-2 focus:ring-admin-accent outline-none placeholder:text-admin-muted" required />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
                  <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-admin-border bg-admin-bg text-admin-text font-body text-sm focus:ring-2 focus:ring-admin-accent outline-none placeholder:text-admin-muted" required />
                </div>
                {error && <p className="font-body text-sm text-red-400">{error}</p>}
                <button type="submit" disabled={isLoading} className="w-full py-3 rounded-full bg-admin-accent text-white font-body font-semibold hover:brightness-110 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enter Dashboard'}
                </button>
                <button type="button" onClick={() => setAdminLoginOpen(false)} className="w-full py-2 font-body text-sm text-admin-muted hover:text-admin-text transition-colors">
                  Cancel
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdminLoginModal;

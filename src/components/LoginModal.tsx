import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, UserIcon } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';

const LoginModal = () => {
  const { isLoginOpen, setLoginOpen, login, register } = useAuthStore();
  const { toast } = useToast();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (tab === 'login') {
      const ok = login(email, password);
      if (ok) {
        toast({ title: '✅ Welcome back!' });
        resetForm();
      } else {
        setError('Invalid email or password.');
      }
    } else {
      if (!name.trim()) { setError('Name is required.'); return; }
      const ok = register(name, email, password);
      if (ok) {
        toast({ title: '🎉 Account created!' });
        resetForm();
      } else {
        setError('Email already registered.');
      }
    }
  };

  const resetForm = () => {
    setName(''); setEmail(''); setPassword(''); setError('');
  };

  return (
    <AnimatePresence>
      {isLoginOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLoginOpen(false)} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="w-full max-w-md bg-background rounded-2xl shadow-2xl overflow-hidden">
              {/* Header image */}
              <div className="relative h-32 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=200&fit=crop" alt="food" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
                <button onClick={() => setLoginOpen(false)} className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors">
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-4">
                  <h3 className="font-display text-xl font-bold text-white">🍜 Kaushi Restaurant</h3>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border">
                <button onClick={() => { setTab('login'); setError(''); }} className={`flex-1 py-3 font-body text-sm font-semibold transition-colors ${tab === 'login' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}>Login</button>
                <button onClick={() => { setTab('register'); setError(''); }} className={`flex-1 py-3 font-body text-sm font-semibold transition-colors ${tab === 'register' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}>Register</button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {tab === 'register' && (
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background font-body text-sm focus:ring-2 focus:ring-ring outline-none" required />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background font-body text-sm focus:ring-2 focus:ring-ring outline-none" required />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background font-body text-sm focus:ring-2 focus:ring-ring outline-none" required minLength={6} />
                </div>
                {error && <p className="font-body text-sm text-destructive">{error}</p>}
                <button type="submit" className="w-full py-3 rounded-full bg-primary text-primary-foreground font-body font-semibold hover:bg-primary-dark transition-colors">
                  {tab === 'login' ? 'Login to Order' : 'Create Account'}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;

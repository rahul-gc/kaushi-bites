import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, UserIcon } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import kaushiLogo from '@/assets/kaushi-logo.png';
import { useToast } from '@/hooks/use-toast';

const LoginModal = () => {
  const { isLoginOpen, setLoginOpen, login, register, loginWithGoogle } = useAuthStore();
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
              {/* Header */}
              <div className="relative h-32 overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent">
                <button onClick={() => setLoginOpen(false)} className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors">
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <img src={kaushiLogo} alt="Kaushi Restaurant" className="h-16 w-16 rounded-full object-cover shadow-lg" />
                    <h3 className="font-display text-xl font-bold text-white">Kaushi Restaurant</h3>
                  </div>
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
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <button 
                  type="button" 
                  onClick={() => {
                    loginWithGoogle();
                    toast({ title: '🔗 Redirecting to Google...' });
                  }}
                  className="w-full py-3 rounded-full border border-border bg-background font-body font-semibold hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
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

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { useAuthStore } from '@/store/authStore';

const supabase = createClient(
  'https://vonldovtaxdsazzeapdu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvbmxkb3Z0YXhkc2F6emVhcGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMjYwMzUsImV4cCI6MjA5MTYwMjAzNX0.X_lQRPPmFosIUJA_7TUI4jMnuoIn6BSPZQeDNX3d3lA'
);

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          navigate('/login');
          return;
        }

        if (data.session) {
          // Get user profile from our backend
          const response = await fetch('/api/auth/google-login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.session.access_token}`
            },
            body: JSON.stringify({
              email: data.session.user.email,
              name: data.session.user.user_metadata?.full_name || data.session.user.email,
              avatar_url: data.session.user.user_metadata?.avatar_url
            })
          });

          const result = await response.json();

          if (response.ok) {
            localStorage.setItem('token', result.token);
            // Update auth store state directly
            useAuthStore.setState({ user: result.user });
            navigate('/');
          } else {
            console.error('Backend auth error:', result.message);
            navigate('/login');
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;

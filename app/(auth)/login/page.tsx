'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Leaf, Mail, Lock, Loader2, User, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignupMode = searchParams?.get('mode') === 'signup';
  const [isLogin, setIsLogin] = useState(!isSignupMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (!isLogin && !name) {
      setError('Please enter your full name.');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;
      } else {
        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            }
          }
        });
        if (authError) throw authError;
      }
      
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Hero Side */}
      <div className="hidden md:flex flex-1 gradient-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="relative z-10 text-center text-white">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-heading text-4xl font-extrabold mb-2">KrishiSetu</h1>
            <p className="text-white/80 text-lg mb-4">ಕೃಷಿ ಸೇತು • कृषि सेतु</p>
            <p className="text-white/60 text-sm max-w-xs mx-auto">
              Your AI Farming Partner — Free, multilingual, and built for Indian farmers
            </p>
          </motion.div>

          {/* Floating emojis */}
          <div className="absolute top-1/4 left-1/4 text-5xl opacity-20 animate-float">🌾</div>
          <div className="absolute bottom-1/3 right-1/4 text-4xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>🚜</div>
          <div className="absolute top-1/3 right-1/3 text-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}>💧</div>
        </div>
      </div>

      {/* Login Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="md:hidden flex flex-col items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-krishisetu-text-primary">KrishiSetu</h1>
            <p className="text-xs text-krishisetu-text-muted">Your AI Farming Partner</p>
          </div>

          <h2 className="font-heading text-2xl font-bold text-krishisetu-text-primary mb-1">
            {isLogin ? 'Welcome back 🌾' : 'Create an account 🌾'}
          </h2>
          <p className="text-sm text-krishisetu-text-muted mb-8">
            {isLogin ? 'Sign in to access your farm dashboard' : 'Join KrishiSetu and start farming smarter'}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 flex items-start gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            
            {/* Show Name Field only when Signing Up */}
            {!isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                <label className="block text-sm font-medium text-krishisetu-text-body mb-1.5 mt-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-krishisetu-text-muted" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ramesh Kumar"
                    className="w-full rounded-xl border border-krishisetu-border bg-white pl-10 pr-3 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    required={!isLogin}
                  />
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-krishisetu-text-body mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-krishisetu-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@example.com"
                  inputMode="email"
                  className="w-full rounded-xl border border-krishisetu-border bg-white pl-10 pr-3 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-krishisetu-text-body mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-krishisetu-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-krishisetu-border bg-white pl-10 pr-3 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  required
                  minLength={6}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password || (!isLogin && !name)}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-base disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> {isLogin ? 'Signing in...' : 'Signing up...'}</>
              ) : (
                <>{isLogin ? 'Sign In' : 'Sign Up'}</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-krishisetu-text-muted">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-primary font-medium hover:underline focus:outline-none"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>

          {/* Social proof — mobile */}
          <div className="mt-6 text-center">
            <p className="text-xs text-krishisetu-text-muted">
              Join 10,000+ farmers already using KrishiSetu
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="px-2 py-0.5 bg-[#f0fdf4] text-[#166534] text-[10px] font-semibold rounded-full">🇮🇳 Karnataka</span>
              <span className="px-2 py-0.5 bg-[#f0fdf4] text-[#166534] text-[10px] font-semibold rounded-full">🇮🇳 Punjab</span>
              <span className="px-2 py-0.5 bg-[#f0fdf4] text-[#166534] text-[10px] font-semibold rounded-full">🇮🇳 Maharashtra</span>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="w-8 h-8 animate-spin text-[#166534]" /></div>}>
      <LoginForm />
    </Suspense>
  );
}

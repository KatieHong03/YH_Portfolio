import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X, CheckCircle2, AlertCircle, ShieldCheck, Mail, Key } from 'lucide-react';
import { loginAdminWithPassword } from '../services/authService';
import { isSupabaseConfigured } from '../lib/supabase';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const isCloud = isSupabaseConfigured();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // If cloud is configured and email is empty, default or ask for email
      const submitEmail = email.trim() || 'admin@katiehong.com';
      const res = await loginAdminWithPassword(submitEmail, password);

      if (res.success) {
        onLoginSuccess();
        onClose();
        setPassword('');
        setEmail('');
      } else {
        setError(res.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-brand-border shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between border-b border-brand-border/40 pb-3">
          <div className="flex items-center gap-2 text-brand-sage">
            <Lock className="w-5 h-5" />
            <h3 className="font-serif font-bold text-lg text-brand-text">Admin Authentication</h3>
          </div>
          <button
            onClick={onClose}
            className="text-brand-muted hover:text-brand-text cursor-pointer p-1 rounded-full hover:bg-brand-bg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <p className="font-sans text-xs text-brand-muted leading-relaxed">
            {isCloud 
              ? 'Sign in with your Supabase administrator account to edit portfolio content and upload media.' 
              : 'Sign in to access portfolio editing mode.'
            }
          </p>

          {isCloud && (
            <div className="space-y-1">
              <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold block">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-sans text-brand-text bg-white border border-brand-border rounded-xl focus:outline-hidden focus:border-brand-sage pl-8"
                  required
                />
                <Mail className="w-3.5 h-3.5 text-brand-muted absolute left-2.5 top-2.5" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-mono text-[9px] uppercase tracking-wider text-brand-muted font-bold block">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono text-brand-text bg-white border border-brand-border rounded-xl focus:outline-hidden focus:border-brand-sage pl-8"
                autoFocus
                required
              />
              <Key className="w-3.5 h-3.5 text-brand-muted absolute left-2.5 top-2.5" />
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
              <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
              <p className="leading-tight">{error}</p>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 bg-brand-sage hover:bg-brand-sage/90 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Verifying...' : 'Unlock Admin Mode'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

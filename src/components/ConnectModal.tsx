/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Linkedin, Copy, Check, Send, X, ExternalLink, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConnectModal({ isOpen, onClose }: ConnectModalProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    senderRole: 'Recruiter / Hiring Manager',
    messageText: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = 'yh3892@columbia.edu';
  const linkedinUrl = 'https://www.linkedin.com/in/yuting-h-21736b27a/';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.senderName || !formData.senderEmail || !formData.messageText) return;

    setIsSubmitting(true);
    const subject = `Portfolio Inquiry from ${formData.senderName} (${formData.senderRole})`;
    const body = `Hi Katie,\n\nName: ${formData.senderName}\nEmail: ${formData.senderEmail}\nRole: ${formData.senderRole}\n\nMessage:\n${formData.messageText}\n\nBest regards,\n${formData.senderName}`;
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setTimeout(() => {
      window.location.href = mailtoUrl;
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({
        senderName: '',
        senderEmail: '',
        senderRole: 'Recruiter / Hiring Manager',
        messageText: ''
      });
      setTimeout(() => {
        setShowSuccess(false);
      }, 4000);
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/55 backdrop-blur-xs cursor-pointer"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: "spring", damping: 25, stiffness: 320 }}
          className="relative z-10 w-full max-w-xl bg-white rounded-3xl border border-brand-border shadow-2xl overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-brand-border/60 bg-[#FAF8F5]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-sage/15 flex items-center justify-center text-brand-sage">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-brand-text leading-snug">
                  Get in Touch
                </h3>
                <p className="font-sans text-[11px] text-brand-muted">
                  Open to opportunities & collaborations
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              id="connect-modal-close-btn"
              className="w-8 h-8 rounded-full bg-white border border-brand-border text-brand-muted hover:text-brand-text hover:bg-brand-bg transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Email Card */}
              <div className="p-4 rounded-2xl bg-brand-bg border border-brand-border/80 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-brand-muted font-bold flex items-center gap-1">
                    <Mail className="w-3 h-3 text-brand-sage" /> Direct Email
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-sage animate-pulse" />
                </div>
                <div className="font-mono text-xs font-semibold text-brand-text truncate">
                  {email}
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="flex-1 py-1.5 px-2.5 bg-white border border-brand-border hover:border-brand-sage rounded-xl text-xs font-semibold text-brand-text flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-brand-sage" />
                        <span className="text-brand-sage font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-brand-muted" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <a
                    href={`mailto:${email}`}
                    className="py-1.5 px-3 bg-brand-text hover:bg-brand-text/90 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all shadow-2xs"
                  >
                    Send <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* LinkedIn Card */}
              <div className="p-4 rounded-2xl bg-brand-bg border border-brand-border/80 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-brand-muted font-bold flex items-center gap-1">
                    <Linkedin className="w-3 h-3 text-brand-blue" /> LinkedIn
                  </span>
                  <span className="text-[10px] font-mono text-brand-muted font-normal">Verified</span>
                </div>
                <div className="font-mono text-xs font-semibold text-brand-text truncate">
                  linkedin.com/in/yuting-h...
                </div>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-1.5 px-3 bg-white border border-brand-border hover:border-brand-blue hover:text-brand-blue rounded-xl text-xs font-semibold text-brand-text flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                >
                  <span>View LinkedIn Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Direct Message Form */}
            <div className="border-t border-brand-border/50 pt-5">
              <div className="flex items-center justify-between mb-3.5">
                <h4 className="font-serif font-bold text-sm text-brand-text flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-brand-sage" /> Leave a Quick Message
                </h4>
                <span className="font-mono text-[10px] text-brand-muted">Opens default mail client</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-brand-muted mb-1 font-semibold">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.senderName}
                      onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                      placeholder="e.g. Alex Smith"
                      className="w-full px-3 py-2 bg-brand-bg border border-brand-border/80 rounded-xl text-xs text-brand-text focus:outline-none focus:border-brand-sage focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-brand-muted mb-1 font-semibold">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.senderEmail}
                      onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                      placeholder="alex@company.com"
                      className="w-full px-3 py-2 bg-brand-bg border border-brand-border/80 rounded-xl text-xs text-brand-text focus:outline-none focus:border-brand-sage focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-brand-muted mb-1 font-semibold">
                    Role / Context
                  </label>
                  <select
                    value={formData.senderRole}
                    onChange={(e) => setFormData({ ...formData, senderRole: e.target.value })}
                    className="w-full px-3 py-2 bg-brand-bg border border-brand-border/80 rounded-xl text-xs text-brand-text focus:outline-none focus:border-brand-sage focus:bg-white transition-colors"
                  >
                    <option value="Recruiter / Hiring Manager">Recruiter / Hiring Manager</option>
                    <option value="Instructional Design Peer">Instructional Design Peer</option>
                    <option value="Academic Researcher">Academic Researcher</option>
                    <option value="Collaborator / Consulting">Collaborator / Consulting</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-brand-muted mb-1 font-semibold">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.messageText}
                    onChange={(e) => setFormData({ ...formData, messageText: e.target.value })}
                    placeholder="Tell me about the role, project, or collaboration..."
                    className="w-full px-3 py-2 bg-brand-bg border border-brand-border/80 rounded-xl text-xs text-brand-text focus:outline-none focus:border-brand-sage focus:bg-white transition-colors resize-none"
                  />
                </div>

                {showSuccess && (
                  <div className="p-2.5 rounded-xl bg-brand-sage/15 border border-brand-sage/30 text-brand-sage text-xs font-medium text-center">
                    Opening your email client with this message...
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-[#2E4A36] hover:bg-[#243B2B] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Preparing Email...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

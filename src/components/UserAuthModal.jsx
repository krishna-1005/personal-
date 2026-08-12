import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { X, Mail, ShieldCheck, RefreshCw, LogOut, CheckCircle2, User, Sparkles } from 'lucide-react';

export const UserAuthModal = ({ isOpen, onClose }) => {
  const {
    currentUserEmail,
    loginWithEmail,
    logoutUser,
    syncDataCloud,
    isSyncing,
    tasks,
    streakData
  } = useTask();

  const [emailInput, setEmailInput] = useState('');
  const [syncStatusMsg, setSyncStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) {
      setSyncStatusMsg('Please enter a valid email address!');
      return;
    }
    const success = loginWithEmail(emailInput.trim());
    if (success) {
      setSyncStatusMsg(`Successfully logged in as ${emailInput.trim()}! Your data is synced.`);
      setTimeout(() => {
        setSyncStatusMsg('');
        onClose();
      }, 1200);
    }
  };

  const handleManualSync = () => {
    syncDataCloud();
    setSyncStatusMsg('Cloud sync completed! All devices with this email are up-to-date.');
    setTimeout(() => setSyncStatusMsg(''), 3000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="auth-header-title">
            <ShieldCheck size={22} color="#06b6d4" />
            <h2>Cross-Device Account & Email Sync</h2>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {currentUserEmail ? (
          /* Active Logged-in State */
          <div className="auth-active-body">
            <div className="auth-user-card glass-panel">
              <div className="user-avatar-wrap">
                <User size={32} color="#6366f1" />
              </div>
              <div className="user-info-text">
                <span className="user-status-tag">ACTIVE ACCOUNT</span>
                <h3 className="user-email-display">{currentUserEmail}</h3>
                <p className="user-meta-sub">
                  {tasks.length} Tasks Synced • {streakData.count} Day Streak
                </p>
              </div>
            </div>

            {syncStatusMsg && (
              <div className="auth-success-alert">
                <CheckCircle2 size={16} color="#10b981" />
                <span>{syncStatusMsg}</span>
              </div>
            )}

            <div className="auth-actions-group">
              <button
                className="btn btn-primary"
                onClick={handleManualSync}
                disabled={isSyncing}
              >
                <RefreshCw size={16} className={isSyncing ? 'spin-icon' : ''} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Now Across Devices'}</span>
              </button>

              <button
                className="btn btn-secondary text-danger"
                onClick={() => { logoutUser(); setSyncStatusMsg('Logged out.'); }}
              >
                <LogOut size={16} />
                <span>Sign Out / Switch Email</span>
              </button>
            </div>

            <p className="auth-footer-note">
              💡 <strong>Tip:</strong> Enter <code>{currentUserEmail}</code> on any desktop, laptop, or smartphone to automatically view and sync your exact data!
            </p>
          </div>
        ) : (
          /* Login Form State */
          <form onSubmit={handleLoginSubmit} className="modal-form">
            <p className="auth-intro-desc">
              Sign in with your Email ID to automatically synchronize all your tasks, habits, notes, and streak progress across all your desktops and smartphones!
            </p>

            <div className="form-group">
              <label>
                <Mail size={16} color="#06b6d4" />
                Email Address
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email (e.g. krishna@gmail.com)..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                autoFocus
              />
            </div>

            {syncStatusMsg && (
              <div className="auth-error-alert">
                <span>{syncStatusMsg}</span>
              </div>
            )}

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Sparkles size={16} />
                <span>Sign In & Sync Devices</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import {
  X,
  UserCheck,
  ShieldCheck,
  RefreshCw,
  LogOut,
  Mail,
  Zap,
  Cloud,
  CloudDownload,
  CloudUpload,
  Smartphone,
  Laptop
} from 'lucide-react';

export const UserAuthModal = () => {
  const {
    currentUserEmail,
    lastSyncedTime,
    loginWithEmail,
    logoutUser,
    pushToOnlineCloud,
    pullFromOnlineCloud,
    isSyncing,
    isAuthModalOpen,
    setIsAuthModalOpen,
    tasks
  } = useTask();

  const [inputEmail, setInputEmail] = useState(currentUserEmail || '');
  const [statusMsg, setStatusMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!inputEmail.trim()) return;
    setStatusMsg('Connecting account & loading cloud tasks...');
    await loginWithEmail(inputEmail);
    setStatusMsg('✅ Account connected & synced across all devices!');
    setTimeout(() => setStatusMsg(''), 3500);
  };

  const handleManualPush = async () => {
    setStatusMsg('Pushing latest tasks to cloud...');
    await pushToOnlineCloud();
    setStatusMsg('✅ Tasks saved to cloud successfully!');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleManualPull = async () => {
    setStatusMsg('Pulling cloud tasks...');
    const success = await pullFromOnlineCloud();
    if (success) {
      setStatusMsg('✅ Cloud tasks imported!');
    } else {
      setStatusMsg('⚡ Cloud is up to date.');
    }
    setTimeout(() => setStatusMsg(''), 3000);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div className="modal-content glass-panel auth-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="auth-header-title">
            <ShieldCheck size={22} color="#06b6d4" />
            <h2>User Profile & Cloud Sync</h2>
          </div>
          <button className="btn-icon" onClick={() => setIsAuthModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Current Active User Profile Card */}
        <div className="auth-user-card glass-panel">
          <div className="user-avatar-wrap">
            <UserCheck size={26} color="#6366f1" />
          </div>
          <div className="user-info-text">
            <span className="user-status-tag">
              <Cloud size={12} color="#10b981" /> 🟢 AUTOMATIC EMAIL SYNC ACTIVE
            </span>
            <span className="user-email-display">{currentUserEmail || 'No Email Signed In'}</span>
            <span className="user-meta-sub">
              {tasks.length} Tasks • Auto-Sync: Every 5s • Last Sync: {lastSyncedTime || 'Just Now'}
            </span>
          </div>
        </div>

        {statusMsg && (
          <div className="auth-success-alert">
            <Zap size={15} />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Automatic Device Sync Explanation */}
        <div className="cloud-pairing-section glass-panel">
          <div className="pairing-header">
            <Smartphone size={18} color="#06b6d4" />
            <Laptop size={18} color="#6366f1" />
            <span>Instant Zero-Click Cross-Device Sync</span>
          </div>
          <p className="pairing-hint" style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            Simply enter your email address on any Desktop, Mobile Phone, or Vercel link. Your tasks, daily habits, and streak progress will <strong>AUTOMATICALLY sync in real-time</strong> across all your devices without copying keys!
          </p>
        </div>

        {/* Email Login / Switch Form */}
        <form onSubmit={handleLoginSubmit} className="email-change-form" style={{ marginBottom: '1.2rem' }}>
          <label className="input-label" style={{ fontSize: '0.84rem', fontWeight: '700', marginBottom: '0.4rem', display: 'block' }}>
            Sync Account Email:
          </label>
          <div className="form-input-group">
            <Mail size={16} className="input-icon-prefix" />
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email (e.g. krishkulkarni1005@gmail.com)..."
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary btn-sm">
              <RefreshCw size={14} className={isSyncing ? 'spin-icon' : ''} />
              <span>Connect</span>
            </button>
          </div>
        </form>

        {/* Sync Controls Group */}
        <div className="cloud-sync-btn-row" style={{ marginBottom: '1rem' }}>
          <button className="btn btn-secondary flex-1" onClick={handleManualPush} disabled={isSyncing}>
            <CloudUpload size={16} color="#6366f1" />
            <span>{isSyncing ? 'Pushing...' : 'Push to Cloud'}</span>
          </button>
          <button className="btn btn-secondary flex-1" onClick={handleManualPull} disabled={isSyncing}>
            <CloudDownload size={16} color="#06b6d4" />
            <span>{isSyncing ? 'Pulling...' : 'Pull from Cloud'}</span>
          </button>
        </div>

        <div className="modal-footer">
          {currentUserEmail && (
            <button className="btn-text-danger" onClick={logoutUser}>
              <LogOut size={14} />
              <span>Disconnect Account</span>
            </button>
          )}
          <button className="btn btn-secondary" onClick={() => setIsAuthModalOpen(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

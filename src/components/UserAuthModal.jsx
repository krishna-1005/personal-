import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import {
  X,
  UserCheck,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  Smartphone,
  Laptop,
  ArrowRight,
  LogOut,
  Mail,
  Zap,
  Cloud,
  CloudDownload,
  CloudUpload
} from 'lucide-react';

export const UserAuthModal = () => {
  const {
    currentUserEmail,
    cloudSyncId,
    lastSyncedTime,
    loginWithEmail,
    logoutUser,
    connectCloudSyncId,
    pushToOnlineCloud,
    pullFromOnlineCloud,
    isSyncing,
    isAuthModalOpen,
    setIsAuthModalOpen,
    tasks
  } = useTask();

  const [inputEmail, setInputEmail] = useState(currentUserEmail || '');
  const [manualSyncId, setManualSyncId] = useState('');
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!inputEmail.trim()) return;
    setStatusMsg('Connecting to account & syncing data...');
    await loginWithEmail(inputEmail);
    setStatusMsg('✅ Account connected & synced across devices!');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleConnectSyncIdSubmit = async (e) => {
    e.preventDefault();
    if (!manualSyncId.trim()) return;
    setStatusMsg('Linking cloud sync ID...');
    const success = await connectCloudSyncId(manualSyncId.trim());
    if (success) {
      setStatusMsg('✅ Devices paired successfully! Tasks imported.');
      setManualSyncId('');
    } else {
      setStatusMsg('⚠️ Could not find cloud record for this Sync ID.');
    }
    setTimeout(() => setStatusMsg(''), 3500);
  };

  const handleCopySyncLink = () => {
    if (!cloudSyncId) return;
    const syncUrl = `${window.location.origin}${window.location.pathname}?syncId=${cloudSyncId}`;
    navigator.clipboard.writeText(syncUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div className="modal-content glass-panel auth-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="auth-header-title">
            <ShieldCheck size={22} color="#06b6d4" />
            <h2>Cross-Device Cloud Sync</h2>
          </div>
          <button className="btn-icon" onClick={() => setIsAuthModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <p className="auth-intro-desc">
          Sync your tasks, daily habits, and streak progress real-time across Desktop, Mobile, and Vercel deployments.
        </p>

        {/* Current Active User Profile Card */}
        <div className="auth-user-card glass-panel">
          <div className="user-avatar-wrap">
            <UserCheck size={26} color="#6366f1" />
          </div>
          <div className="user-info-text">
            <span className="user-status-tag">
              <Cloud size={12} color="#10b981" /> 🟢 REAL-TIME CLOUD ACTIVE
            </span>
            <span className="user-email-display">{currentUserEmail || 'No Email Signed In'}</span>
            <span className="user-meta-sub">
              {tasks.length} Tasks • Last Sync: {lastSyncedTime || 'Just Now'}
            </span>
          </div>
        </div>

        {statusMsg && (
          <div className="auth-success-alert">
            <Zap size={15} />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Cloud Pairing Section */}
        <div className="cloud-pairing-section glass-panel">
          <div className="pairing-header">
            <Smartphone size={18} color="#06b6d4" />
            <Laptop size={18} color="#6366f1" />
            <span>Device Pairing & Mobile Link</span>
          </div>

          {cloudSyncId ? (
            <div className="sync-key-display-wrap">
              <label className="input-label">Your Cloud Sync Key:</label>
              <div className="sync-key-box">
                <code className="sync-code-text">{cloudSyncId}</code>
                <button className="btn btn-secondary btn-sm" onClick={handleCopySyncLink}>
                  {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  <span>{copied ? 'Link Copied!' : 'Copy Mobile Link'}</span>
                </button>
              </div>
              <p className="pairing-hint">
                Open this link on your Mobile Phone browser to instantly pair devices!
              </p>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => connectCloudSyncId()}>
              <RefreshCw size={15} className={isSyncing ? 'spin-icon' : ''} />
              <span>Generate Cloud Sync Key</span>
            </button>
          )}

          {/* Manual Link Input */}
          <form onSubmit={handleConnectSyncIdSubmit} className="manual-link-form">
            <label className="input-label">Pair Mobile with Existing Sync Key:</label>
            <div className="form-input-group">
              <input
                type="text"
                className="form-input"
                placeholder="Paste Sync Key here..."
                value={manualSyncId}
                onChange={(e) => setManualSyncId(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary btn-sm">
                <span>Link</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        </div>

        {/* Sync Controls Group */}
        <div className="auth-actions-group">
          <div className="cloud-sync-btn-row">
            <button className="btn btn-secondary flex-1" onClick={() => pushToOnlineCloud()} disabled={isSyncing}>
              <CloudUpload size={16} color="#6366f1" />
              <span>{isSyncing ? 'Pushing...' : 'Push Tasks to Cloud'}</span>
            </button>
            <button className="btn btn-secondary flex-1" onClick={() => pullFromOnlineCloud()} disabled={isSyncing}>
              <CloudDownload size={16} color="#06b6d4" />
              <span>{isSyncing ? 'Pulling...' : 'Pull Tasks from Cloud'}</span>
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="email-change-form">
            <label className="input-label">Switch Email Account:</label>
            <div className="form-input-group">
              <Mail size={16} className="input-icon-prefix" />
              <input
                type="email"
                className="form-input"
                placeholder="Enter email address..."
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary btn-sm">
                <span>Connect</span>
              </button>
            </div>
          </form>
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

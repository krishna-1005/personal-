import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Shield, CheckCircle2 } from 'lucide-react';

export const OpeningSplash = () => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Focus Engine...');
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1800; // 1.8 seconds startup sequence

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 35) {
        setStatusText('Loading Focus Soundscapes & State...');
      } else if (pct < 75) {
        setStatusText('Syncing Daily Streaks & Habits Engine...');
      } else if (pct < 100) {
        setStatusText('Optimizing Workflow & Analytics...');
      } else {
        setStatusText('Engine Ready. Welcome Back, Champion! 🚀');
        clearInterval(interval);

        // Start curtain fade out
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            setIsVisible(false);
          }, 600);
        }, 300);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`opening-splash-overlay ${isFadingOut ? 'splash-fade-out' : ''}`}>
      <div className="splash-background-glow">
        <div className="splash-orb-1" />
        <div className="splash-orb-2" />
      </div>

      <div className="splash-container">
        {/* Holographic Logo Icon Ring */}
        <div className="splash-logo-wrapper">
          <div className="splash-pulse-ring-1" />
          <div className="splash-pulse-ring-2" />
          <div className="splash-logo-core">
            <Sparkles size={48} className="splash-sparkle-anim" color="#6366f1" />
          </div>
        </div>

        {/* Title & Slogan */}
        <div className="splash-text-group">
          <h1 className="splash-brand-title">
            TaskPulse <span className="title-highlight">PRO</span>
          </h1>
          <p className="splash-tagline">YOUR ULTIMATE PERSONAL PRODUCTIVITY COMMAND CENTER</p>
        </div>

        {/* Progress Bar & Status Line */}
        <div className="splash-progress-wrapper">
          <div className="splash-progress-bar-bg">
            <div className="splash-progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="splash-status-line">
            <span className="splash-status-msg">{statusText}</span>
            <span className="splash-pct">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

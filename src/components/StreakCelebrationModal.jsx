import React from 'react';
import { useTask } from '../context/TaskContext';
import { Flame, X, Trophy, Sparkles, Zap, CheckCircle2 } from 'lucide-react';

export const StreakCelebrationModal = () => {
  const { showStreakModal, setShowStreakModal, celebratedStreakNum } = useTask();

  if (!showStreakModal) return null;

  return (
    <div className="modal-overlay streak-modal-overlay" onClick={() => setShowStreakModal(false)}>
      <div className="modal-content streak-modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="btn-icon modal-close-corner" onClick={() => setShowStreakModal(false)}>
          <X size={20} />
        </button>

        <div className="streak-badge-hero">
          <div className="fire-orb">
            <Flame size={48} className="flame-anim" color="#f59e0b" />
          </div>
        </div>

        <div className="streak-modal-body">
          <span className="streak-tag">
            <Sparkles size={14} /> DAILY STREAK UNLOCKED!
          </span>
          <h2>{celebratedStreakNum} Day Streak Achieved! 🎉</h2>
          <p>
            You completed your daily target for today! Consistency builds extraordinary habits. Keep the momentum going!
          </p>

          <div className="streak-rewards-card glass-panel">
            <div className="reward-item">
              <Trophy size={20} color="#f59e0b" />
              <span>Current Streak: <strong>{celebratedStreakNum} Days</strong></span>
            </div>
            <div className="reward-item">
              <CheckCircle2 size={20} color="#10b981" />
              <span>Status: <strong>Active Today ⚡</strong></span>
            </div>
          </div>

          <button className="btn btn-primary btn-xl w-full streak-claim-btn" onClick={() => setShowStreakModal(false)}>
            <Zap size={18} /> Keep Building Streak
          </button>
        </div>
      </div>
    </div>
  );
};

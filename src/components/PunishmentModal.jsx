import React from 'react';
import { useTask } from '../context/TaskContext';
import { AlertTriangle, ShieldAlert, CheckCircle2, Zap, X, Dumbbell, PhoneOff, Droplets, Edit3, Clock } from 'lucide-react';

export const PunishmentModal = () => {
  const {
    activePunishment,
    punishmentTargetTask,
    acceptAndCompletePunishment,
    startTaskTimer
  } = useTask();

  if (!activePunishment) return null;

  const handleRescueSprint = () => {
    if (punishmentTargetTask) {
      startTaskTimer(punishmentTargetTask.id);
    }
    acceptAndCompletePunishment();
  };

  return (
    <div className="modal-overlay punishment-modal-overlay">
      <div className="modal-content punishment-modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="punishment-badge-hero">
          <div className="alert-orb">
            <ShieldAlert size={48} className="shield-pulse-anim" color="#ef4444" />
          </div>
        </div>

        <div className="punishment-body">
          <span className="punishment-tag">
            <AlertTriangle size={14} /> ACCOUNTABILITY DISCIPLINE PENALTY
          </span>

          <h2>Task Missed! Take Your Punishment 🚨</h2>

          <p className="punishment-subtext">
            Consistency is built through extreme accountability. You missed completing:
          </p>

          <div className="missed-task-card glass-panel">
            <span className="missed-label">MISSED TASK</span>
            <h4>{punishmentTargetTask ? punishmentTargetTask.title : 'Daily Task Target'}</h4>
            {punishmentTargetTask?.dueDate && <span className="missed-date">Target Date: {punishmentTargetTask.dueDate}</span>}
          </div>

          <div className="punishment-challenge-card glass-panel">
            <span className="challenge-label">ASSIGNED DISCIPLINE CHALLENGE</span>
            <h3>{activePunishment.title}</h3>
            <p>{activePunishment.description}</p>
          </div>

          <div className="punishment-actions-grid">
            <button className="btn btn-primary btn-xl claim-punishment-btn" onClick={acceptAndCompletePunishment}>
              <CheckCircle2 size={18} /> I Have Completed This Punishment ⚡
            </button>

            {punishmentTargetTask && (
              <button className="btn btn-secondary rescue-sprint-btn" onClick={handleRescueSprint}>
                <Clock size={16} color="#f59e0b" />
                <span>Emergency 10-Min Rescue Sprint</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

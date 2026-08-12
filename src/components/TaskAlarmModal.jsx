import React from 'react';
import { useTask } from '../context/TaskContext';
import { Bell, CheckCircle2, Clock, Plus, X, AlertCircle, Sparkles } from 'lucide-react';

export const TaskAlarmModal = () => {
  const {
    alarmTask,
    stopAlarmSound,
    toggleTaskComplete,
    addExtraMinutesToTaskTimer
  } = useTask();

  if (!alarmTask) return null;

  const handleComplete = () => {
    toggleTaskComplete(alarmTask.id);
    stopAlarmSound();
  };

  return (
    <div className="modal-overlay alarm-modal-overlay" onClick={stopAlarmSound}>
      <div className="modal-content alarm-modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="btn-icon modal-close-corner" onClick={stopAlarmSound}>
          <X size={20} />
        </button>

        {/* Pulsing Alarm Icon */}
        <div className="alarm-icon-ring">
          <Bell size={48} className="bell-ringing-anim" color="#ef4444" />
        </div>

        <div className="alarm-body">
          <span className="alarm-badge">
            <AlertCircle size={14} /> TIMER COMPLETED!
          </span>

          <h2>Time is up for your task! ⏰</h2>
          
          <div className="alarm-task-card glass-panel">
            <h3>{alarmTask.title}</h3>
            {alarmTask.description && <p>{alarmTask.description}</p>}
            <div className="alarm-task-tags">
              <span className={`badge-priority ${alarmTask.priority}`}>{alarmTask.priority} priority</span>
              <span className="alarm-time-tag"><Clock size={12} /> {alarmTask.estimatedTime}m session done</span>
            </div>
          </div>

          <p className="alarm-subtext">
            Awesome focus effort! Mark task as completed or add extra focus time:
          </p>

          <div className="alarm-actions-grid">
            <button className="btn btn-primary btn-xl complete-alarm-btn" onClick={handleComplete}>
              <CheckCircle2 size={18} /> Mark Complete & Claim
            </button>

            <button className="btn btn-secondary snooze-alarm-btn" onClick={() => addExtraMinutesToTaskTimer(5)}>
              <Plus size={16} /> Add 5 Minutes
            </button>

            <button className="btn btn-secondary dismiss-alarm-btn" onClick={stopAlarmSound}>
              <X size={16} /> Dismiss Alarm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

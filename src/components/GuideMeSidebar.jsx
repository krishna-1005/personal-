import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { X, Sparkles, Command, CheckSquare, Timer, ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';

const GUIDE_STEPS = [
  {
    step: 1,
    title: 'Organize & Prioritize Tasks',
    icon: CheckSquare,
    color: '#6366f1',
    description: 'Assign priorities (Urgent, High, Medium, Low) and categories to stay structured. Star important items to keep them pinned.',
    tips: [
      'Click the checkbox to complete a task and trigger a celebration confetti effect!',
      'Use Categories in the sidebar to group Work, Personal, and Project goals.'
    ]
  },
  {
    step: 2,
    title: 'Master Subtasks & Checklists',
    icon: Command,
    color: '#06b6d4',
    description: 'Break down overwhelming projects into smaller, manageable subtasks.',
    tips: [
      'Click the subtask toggle to expand a task checklist.',
      'Track progress percentages in real-time on task cards.'
    ]
  },
  {
    step: 3,
    title: 'Boost Focus with Pomodoro Timer',
    icon: Timer,
    color: '#a855f7',
    description: 'Work in focused 25-minute intervals followed by 5-minute restorative breaks.',
    tips: [
      'Click the Timer icon on any task card to start a dedicated focus session.',
      'Log focus sessions automatically to build your daily streak score.'
    ]
  },
  {
    step: 4,
    title: 'Speed Up with Keyboard Shortcuts',
    icon: Sparkles,
    color: '#f59e0b',
    description: 'Use instant hotkeys to navigate TaskPulse Pro like a power user:',
    shortcuts: [
      { key: 'N', label: 'Create New Task' },
      { key: '/', label: 'Focus Search Bar' },
      { key: 'Esc', label: 'Close Modals or Drawer' }
    ]
  }
];

export const GuideMeSidebar = () => {
  const { isGuideOpen, setIsGuideOpen } = useTask();
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  if (!isGuideOpen) return null;

  const currentStep = GUIDE_STEPS[activeStepIdx];
  const IconComponent = currentStep.icon;

  return (
    <div className="guide-me-overlay" onClick={() => setIsGuideOpen(false)}>
      <div className="guide-me-drawer glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="guide-header">
          <div className="guide-title-wrap">
            <BookOpen size={20} color="#f59e0b" />
            <h3>Guide Me — Productive Hub</h3>
          </div>
          <button className="btn-icon" onClick={() => setIsGuideOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Step Navigation Tabs */}
        <div className="guide-step-tabs">
          {GUIDE_STEPS.map((s, idx) => (
            <button
              key={s.step}
              className={`guide-step-dot ${activeStepIdx === idx ? 'active' : ''}`}
              onClick={() => setActiveStepIdx(idx)}
              title={`Step ${s.step}: ${s.title}`}
            >
              {s.step}
            </button>
          ))}
        </div>

        {/* Active Step Content */}
        <div className="guide-body">
          <div className="guide-step-badge" style={{ backgroundColor: `${currentStep.color}20`, color: currentStep.color }}>
            <IconComponent size={18} />
            <span>STEP {currentStep.step} OF {GUIDE_STEPS.length}</span>
          </div>

          <h4 className="guide-step-title">{currentStep.title}</h4>
          <p className="guide-step-desc">{currentStep.description}</p>

          {currentStep.tips && (
            <div className="guide-tips-box">
              <h5>PRO TIPS:</h5>
              <ul>
                {currentStep.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {currentStep.shortcuts && (
            <div className="guide-shortcuts-box">
              <h5>KEYBOARD SHORTCUTS:</h5>
              <div className="shortcuts-grid">
                {currentStep.shortcuts.map((sc, i) => (
                  <div key={i} className="shortcut-row">
                    <kbd>{sc.key}</kbd>
                    <span>{sc.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Next & Close Controls */}
        <div className="guide-footer">
          {activeStepIdx < GUIDE_STEPS.length - 1 ? (
            <button
              className="btn btn-primary w-full"
              onClick={() => setActiveStepIdx(prev => prev + 1)}
            >
              <span>Next Guide Step</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              className="btn btn-primary w-full"
              onClick={() => setIsGuideOpen(false)}
            >
              <ShieldCheck size={16} />
              <span>Got it! Start Productivity</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useTask } from '../context/TaskContext';
import { Layers, Rocket, BookOpen, RotateCcw, X, Sparkles } from 'lucide-react';

const TEMPLATES = [
  {
    type: 'project',
    title: '🚀 Project Launch Starter',
    desc: 'Generates tasks for requirements planning, database schema design, and component architecture.',
    icon: Rocket,
    color: '#6366f1'
  },
  {
    type: 'study',
    title: '📚 Deep Study & Exam Prep',
    desc: 'Generates active recall study sessions, flashcard creation, and practice problem tasks.',
    icon: BookOpen,
    color: '#06b6d4'
  },
  {
    type: 'weeklyReset',
    title: '🧹 Weekly Organization Reset',
    desc: 'Generates digital inbox cleanup, workspace organizing, and next week priority scheduling.',
    icon: RotateCcw,
    color: '#10b981'
  }
];

export const QuickTemplatesModal = () => {
  const { isTemplatesOpen, setIsTemplatesOpen, loadTemplate } = useTask();

  if (!isTemplatesOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsTemplatesOpen(false)}>
      <div className="modal-content templates-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="templates-header-title">
            <Sparkles size={20} color="#a855f7" />
            <h2>Quick Workflow Templates</h2>
          </div>
          <button className="btn-icon" onClick={() => setIsTemplatesOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <p className="templates-subtitle">
          Instantly load pre-configured task structures and checklists into your agenda:
        </p>

        <div className="templates-list">
          {TEMPLATES.map(t => {
            const IconComp = t.icon;
            return (
              <div key={t.type} className="template-card glass-panel" onClick={() => loadTemplate(t.type)}>
                <div className="template-icon" style={{ backgroundColor: `${t.color}20` }}>
                  <IconComp size={24} color={t.color} />
                </div>
                <div className="template-info">
                  <h4>{t.title}</h4>
                  <p>{t.desc}</p>
                </div>
                <button className="btn btn-secondary btn-sm">Load Preset</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

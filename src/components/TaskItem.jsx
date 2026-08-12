import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import {
  Check,
  Star,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Copy,
  Timer,
  CheckSquare,
  Plus,
  ExternalLink,
  Link2,
  Play,
  Pause,
  Square,
  Globe,
  AlertTriangle
} from 'lucide-react';

export const TaskItem = ({ task }) => {
  const {
    categories,
    runningTaskId,
    activeTimerSeconds,
    isTimerPaused,
    startTaskTimer,
    pauseTaskTimer,
    stopTaskTimer,
    toggleTaskComplete,
    toggleSubtask,
    toggleStar,
    deleteTask,
    duplicateTask,
    setActiveModalTask,
    updateTask,
    triggerPunishmentForMissedTask
  } = useTask();

  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showAddSubtask, setShowAddSubtask] = useState(false);

  const isCurrentTimerRunning = runningTaskId === task.id;

  const categoryObj = categories.find(c => c.id === task.category) || {
    name: task.category,
    color: '#6366f1'
  };

  const completedSubtasks = task.subtasks.filter(s => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const isOverdue = task.dueDate < todayStr && !task.completed;
  const isToday = task.dueDate === todayStr;

  const getDomain = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace(/^www\./, '');
    } catch (e) {
      return 'external-resource';
    }
  };

  const formatMMSS = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddSubtaskSubmit = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const newSub = {
      id: `sub-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false
    };
    updateTask(task.id, {
      subtasks: [...task.subtasks, newSub]
    });
    setNewSubtaskTitle('');
    setShowAddSubtask(false);
  };

  return (
    <div className={`task-card glass-panel ${task.completed ? 'task-completed' : ''} ${isOverdue ? 'task-overdue' : ''} ${isCurrentTimerRunning ? 'timer-active-card' : ''}`}>
      {/* Primary Row */}
      <div className="task-main-row">
        {/* Completion Checkbox */}
        <button
          className={`checkbox-custom ${task.completed ? 'completed' : ''}`}
          onClick={() => toggleTaskComplete(task.id)}
          title={task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
        >
          {task.completed && <Check size={14} color="#ffffff" strokeWidth={3} />}
        </button>

        {/* Task Content */}
        <div className="task-content">
          <div className="task-title-wrap">
            <span className={`task-title ${task.completed ? 'strike-through' : ''}`}>
              {task.title}
            </span>

            {/* Priority Badge */}
            <span className={`badge-priority ${task.priority}`}>
              {task.priority}
            </span>

            {/* Category Tag */}
            <span
              className="category-pill"
              style={{ backgroundColor: `${categoryObj.color}20`, color: categoryObj.color, border: `1px solid ${categoryObj.color}40` }}
            >
              {categoryObj.name}
            </span>
          </div>

          {/* Task Description */}
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          {/* Resource Link Launcher */}
          {task.linkUrl && (
            <div className="task-link-wrapper">
              <a
                href={task.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="task-resource-link-card"
                onClick={(e) => e.stopPropagation()}
                title={`Open ${task.linkUrl}`}
              >
                <div className="link-card-left">
                  <Globe size={15} className="globe-icon" color="#06b6d4" />
                  <span className="link-domain">{getDomain(task.linkUrl)}</span>
                </div>
                <div className="link-card-right">
                  <span>Open Resource</span>
                  <ExternalLink size={13} />
                </div>
              </a>
            </div>
          )}

          {/* Live Task Timer Controls Bar */}
          {!task.completed && (
            <div className="task-timer-bar">
              {isCurrentTimerRunning ? (
                <div className="running-timer-controls">
                  <div className="live-countdown-badge">
                    <Timer size={15} className="pulse-timer-icon" color="#06b6d4" />
                    <span className="live-time-digits">{formatMMSS(activeTimerSeconds)}</span>
                    <span className="timer-state-label">{isTimerPaused ? 'PAUSED' : 'COUNTING DOWN'}</span>
                  </div>

                  {isTimerPaused ? (
                    <button className="btn btn-secondary btn-sm timer-btn-resume" onClick={() => startTaskTimer(task.id)}>
                      <Play size={14} /> Resume
                    </button>
                  ) : (
                    <button className="btn btn-secondary btn-sm timer-btn-pause" onClick={pauseTaskTimer}>
                      <Pause size={14} /> Pause
                    </button>
                  )}

                  <button className="btn btn-secondary btn-sm timer-btn-stop" onClick={stopTaskTimer} title="End / Reset Timer">
                    <Square size={13} color="#ef4444" /> End
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-secondary btn-sm start-timer-card-btn"
                  onClick={() => startTaskTimer(task.id)}
                  title="Start countdown timer for this task"
                >
                  <Play size={14} color="#10b981" />
                  <span>Start Task Timer ({task.estimatedTime || 15}m)</span>
                </button>
              )}
            </div>
          )}

          {/* Meta Info Line (Due date, Subtasks, Tags) */}
          <div className="task-meta">
            <div className={`meta-item date-item ${isOverdue ? 'overdue' : isToday ? 'today' : ''}`}>
              <Calendar size={13} />
              <span>{isToday ? 'Today' : task.dueDate}</span>
            </div>

            {/* Overdue Punishment Button */}
            {!task.completed && (
              <button
                className="btn-punishment-trigger"
                onClick={() => triggerPunishmentForMissedTask(task)}
                title="Missed/Procrastinated Task? Trigger Discipline Punishment Challenge"
              >
                <AlertTriangle size={13} />
                <span>Missed Task? Trigger Punishment</span>
              </button>
            )}

            {task.tags && task.tags.length > 0 && (
              <div className="tags-container">
                {task.tags.map((tag, idx) => (
                  <span key={idx} className="tag-pill">#{tag}</span>
                ))}
              </div>
            )}

            {totalSubtasks > 0 && (
              <button className="subtasks-toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
                <CheckSquare size={13} />
                <span>{completedSubtasks}/{totalSubtasks} Subtasks ({subtaskProgress}%)</span>
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>

          {/* Subtask Progress Bar */}
          {totalSubtasks > 0 && (
            <div className="subtask-progress-bar">
              <div
                className="subtask-progress-fill"
                style={{ width: `${subtaskProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* Right Action Icons */}
        <div className="task-actions">
          <button
            className={`btn-icon star-btn ${task.starred ? 'is-starred' : ''}`}
            onClick={() => toggleStar(task.id)}
            title={task.starred ? 'Unstar Task' : 'Star Task'}
          >
            <Star size={17} fill={task.starred ? '#f59e0b' : 'none'} color={task.starred ? '#f59e0b' : 'currentColor'} />
          </button>

          <button
            className="btn-icon"
            onClick={() => setActiveModalTask(task)}
            title="Edit Task"
          >
            <Edit2 size={16} />
          </button>

          <button
            className="btn-icon"
            onClick={() => duplicateTask(task.id)}
            title="Duplicate Task"
          >
            <Copy size={16} />
          </button>

          <button
            className="btn-icon delete-btn"
            onClick={() => deleteTask(task.id)}
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Expandable Subtasks Checklist Accordion */}
      {isExpanded && (
        <div className="subtasks-accordion">
          <div className="subtasks-header">
            <span>CHECKLIST</span>
            <button className="add-subtask-trigger" onClick={() => setShowAddSubtask(true)}>
              <Plus size={14} /> Add item
            </button>
          </div>

          <div className="subtasks-list">
            {task.subtasks.map(sub => (
              <div key={sub.id} className="subtask-item">
                <button
                  className={`checkbox-custom sub-check ${sub.completed ? 'completed' : ''}`}
                  onClick={() => toggleSubtask(task.id, sub.id)}
                >
                  {sub.completed && <Check size={12} color="#ffffff" strokeWidth={3} />}
                </button>
                <span className={`subtask-title ${sub.completed ? 'strike-through' : ''}`}>
                  {sub.title}
                </span>
              </div>
            ))}
          </div>

          {showAddSubtask && (
            <form onSubmit={handleAddSubtaskSubmit} className="add-subtask-form">
              <input
                type="text"
                className="form-input subtask-input"
                placeholder="Enter subtask title..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                autoFocus
              />
              <button type="submit" className="btn btn-primary btn-sm">Add</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddSubtask(false)}>Cancel</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

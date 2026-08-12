import React, { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import { X, Plus, Trash2, Tag, Star, Calendar, Clock, Sparkles, Wand2, Link2, CheckSquare } from 'lucide-react';

export const TaskModal = () => {
  const {
    activeModalTask,
    setActiveModalTask,
    categories,
    addTask,
    updateTask
  } = useTask();

  const isEditing = activeModalTask && activeModalTask !== 'new';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('personal');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [estimatedTime, setEstimatedTime] = useState(25);
  const [linkUrl, setLinkUrl] = useState('');
  const [starred, setStarred] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [subtasks, setSubtasks] = useState([]);
  const [subtaskInput, setSubtaskInput] = useState('');

  useEffect(() => {
    if (isEditing) {
      setTitle(activeModalTask.title || '');
      setDescription(activeModalTask.description || '');
      setCategory(activeModalTask.category || 'personal');
      setPriority(activeModalTask.priority || 'medium');
      setDueDate(activeModalTask.dueDate || new Date().toISOString().split('T')[0]);
      setEstimatedTime(activeModalTask.estimatedTime || 25);
      setLinkUrl(activeModalTask.linkUrl || '');
      setStarred(!!activeModalTask.starred);
      setTags(activeModalTask.tags || []);
      setSubtasks(activeModalTask.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setCategory('personal');
      setPriority('medium');
      setDueDate(new Date().toISOString().split('T')[0]);
      setEstimatedTime(25);
      setLinkUrl('');
      setStarred(false);
      setTags([]);
      setSubtasks([]);
    }
  }, [activeModalTask]);

  if (!activeModalTask) return null;

  const handleAutoDecompose = () => {
    if (!title.trim()) {
      alert('Please enter a task title first!');
      return;
    }

    const t = title.toLowerCase();
    let generated = [];

    if (t.includes('code') || t.includes('build') || t.includes('app') || t.includes('web') || t.includes('site')) {
      generated = [
        { id: `gen-1`, title: 'Define project architecture & specs', completed: false },
        { id: `gen-2`, title: 'Implement UI components & styling', completed: false },
        { id: `gen-3`, title: 'Connect data logic & state management', completed: false },
        { id: `gen-4`, title: 'Test, fix bugs & verify build', completed: false }
      ];
    } else if (t.includes('study') || t.includes('learn') || t.includes('read') || t.includes('exam')) {
      generated = [
        { id: `gen-1`, title: 'Review core notes & chapter summaries', completed: false },
        { id: `gen-2`, title: 'Create active recall flashcards', completed: false },
        { id: `gen-3`, title: 'Complete practice questions', completed: false }
      ];
    } else {
      generated = [
        { id: `gen-1`, title: 'Outline key steps & deliverables', completed: false },
        { id: `gen-2`, title: 'Execute primary action item', completed: false },
        { id: `gen-3`, title: 'Review output & finalize details', completed: false }
      ];
    }

    setSubtasks([...subtasks, ...generated]);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleAddSubtask = (e) => {
    if (e) e.preventDefault();
    if (!subtaskInput.trim()) return;
    setSubtasks([...subtasks, { id: `sub-${Date.now()}`, title: subtaskInput.trim(), completed: false }]);
    setSubtaskInput('');
  };

  const removeSubtask = (subId) => {
    setSubtasks(subtasks.filter(s => s.id !== subId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      title,
      description,
      category,
      priority,
      dueDate,
      estimatedTime,
      linkUrl,
      starred,
      tags,
      subtasks
    };

    if (isEditing) {
      updateTask(activeModalTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setActiveModalTask(null)}>
      <div className="modal-content glass-panel modal-luxury-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Sparkles size={20} color="#6366f1" />
            <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
          </div>
          <button className="btn-icon" onClick={() => setActiveModalTask(null)}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Task Title */}
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              className="form-input title-input"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Direct Resource Link Input */}
          <div className="form-group">
            <label className="form-label link-input-label">
              <Link2 size={15} color="#06b6d4" />
              <span>Direct Resource Link / URL (Optional)</span>
            </label>
            <input
              type="url"
              className="form-input link-url-input"
              placeholder="Paste URL (e.g. https://github.com, https://docs.google.com)..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description & Notes</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Add details, steps, links, or context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🟠 High</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </div>
          </div>

          {/* Due Date & Est Duration */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label"><Calendar size={14} /> Due Date</label>
              <input
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label"><Clock size={14} /> Est. Duration (Minutes)</label>
              <input
                type="number"
                className="form-input"
                min={5}
                max={480}
                step={5}
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
              />
            </div>
          </div>

          {/* Subtasks Builder */}
          <div className="form-group">
            <div className="subtask-label-row">
              <label className="form-label"><CheckSquare size={14} /> Subtasks Checklist ({subtasks.length})</label>
              <button
                type="button"
                className="btn-decompose"
                onClick={handleAutoDecompose}
                title="Auto-generate subtasks based on title"
              >
                <Wand2 size={13} /> Auto-Breakdown Steps
              </button>
            </div>

            {subtasks.length > 0 && (
              <div className="subtask-builder-list">
                {subtasks.map((sub, i) => (
                  <div key={sub.id} className="subtask-builder-item">
                    <span>{i + 1}. {sub.title}</span>
                    <button type="button" className="btn-icon text-danger" onClick={() => removeSubtask(sub.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="subtask-input-row">
              <input
                type="text"
                className="form-input"
                placeholder="Add subtask item..."
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubtask(e); }}
              />
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddSubtask}>
                <Plus size={15} /> Add
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label"><Tag size={14} /> Tags</label>
            <div className="tags-input-box">
              {tags.map((t, idx) => (
                <span key={idx} className="tag-pill">
                  #{t}
                  <button type="button" className="tag-remove-btn" onClick={() => removeTag(t)}>&times;</button>
                </span>
              ))}
              <input
                type="text"
                className="tag-bare-input"
                placeholder="Type tag & press Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
            </div>
          </div>

          {/* Starred Checkbox */}
          <div className="form-group checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={starred}
                onChange={(e) => setStarred(e.target.checked)}
              />
              <Star size={16} color={starred ? '#f59e0b' : 'currentColor'} fill={starred ? '#f59e0b' : 'none'} />
              <span>Mark as Starred / High Priority Task</span>
            </label>
          </div>

          {/* Modal Footer Actions */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setActiveModalTask(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

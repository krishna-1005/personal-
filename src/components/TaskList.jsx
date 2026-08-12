import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { TaskItem } from './TaskItem';
import { CheckCircle2, Plus, Sparkles, Filter, Inbox, Calendar, Clock, Star, Folder, Briefcase, User, Code, Activity, DollarSign } from 'lucide-react';

const ICON_MAP = {
  Briefcase: Briefcase,
  User: User,
  Code: Code,
  Activity: Activity,
  DollarSign: DollarSign,
  Folder: Folder,
};

export const TaskList = () => {
  const {
    tasks,
    categories,
    activeView,
    searchQuery,
    sortBy,
    setActiveModalTask
  } = useTask();

  const [priorityFilter, setPriorityFilter] = useState('all');

  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Filter by Active View Navigation
  let filtered = tasks.filter(task => {
    switch (activeView) {
      case 'inbox':
        return !task.completed;
      case 'today':
        return !task.completed && task.dueDate === todayStr;
      case 'upcoming':
        return !task.completed && task.dueDate > todayStr;
      case 'starred':
        return task.starred;
      case 'completed':
        return task.completed;
      default:
        return task.category === activeView && !task.completed;
    }
  });

  // 2. Filter by Search Query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(t =>
      t.title.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
    );
  }

  // 3. Filter by Priority Badge
  if (priorityFilter !== 'all') {
    filtered = filtered.filter(t => t.priority === priorityFilter);
  }

  // 4. Sort Tasks
  filtered.sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === 'priority') {
      const priorityRank = { urgent: 1, high: 2, medium: 3, low: 4 };
      return (priorityRank[a.priority] || 5) - (priorityRank[b.priority] || 5);
    }
    if (sortBy === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'created') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  // Category Icon helper
  const currentCategory = categories.find(c => c.id === activeView);
  const CategoryIcon = currentCategory ? (ICON_MAP[currentCategory.icon] || Folder) : Inbox;

  return (
    <div className="task-list-container">
      {/* Priority Filter Bar */}
      <div className="filter-bar">
        <div className="filter-pills">
          <span className="filter-label"><Filter size={14} /> Priority:</span>
          {['all', 'urgent', 'high', 'medium', 'low'].map(p => (
            <button
              key={p}
              className={`filter-pill ${priorityFilter === p ? 'active' : ''}`}
              onClick={() => setPriorityFilter(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        <span className="tasks-count-summary">
          {filtered.length} {filtered.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {/* Task Cards Grid */}
      {filtered.length > 0 ? (
        <div className="task-cards-grid">
          {filtered.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      ) : (
        /* Elevated Empty State UI */
        <div className="empty-state glass-panel">
          <div className="empty-icon-wrap" style={{ backgroundColor: currentCategory ? `${currentCategory.color}20` : 'rgba(99, 102, 241, 0.15)' }}>
            <CategoryIcon size={44} color={currentCategory ? currentCategory.color : '#6366f1'} />
          </div>
          <h3>No pending tasks in {currentCategory ? currentCategory.name : 'this view'}</h3>
          <p>
            {searchQuery
              ? `No matches found for "${searchQuery}". Try adjusting search terms or filters.`
              : `You are all caught up! Click below to add a new item to your ${currentCategory ? currentCategory.name : 'agenda'}.`}
          </p>
          <button
            className="btn btn-primary empty-add-btn"
            onClick={() => setActiveModalTask('new')}
          >
            <Plus size={18} />
            <span>Create Task</span>
          </button>
        </div>
      )}
    </div>
  );
};

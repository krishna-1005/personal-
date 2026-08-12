import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { TaskItem } from './TaskItem';
import {
  CheckCircle2,
  Plus,
  Sparkles,
  Filter,
  Inbox,
  Calendar,
  Clock,
  Star,
  Folder,
  Briefcase,
  User,
  Code,
  Activity,
  DollarSign,
  CalendarDays,
  ListFilter,
  AlertCircle,
  Sun,
  SlidersHorizontal
} from 'lucide-react';

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
  const [viewMode, setViewMode] = useState('day-split');

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date(Date.now() + 86400000);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

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
      case 'day-schedule':
        return !task.completed;
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

  // Group Tasks Day-Wise
  const groupTasksByDay = (taskList) => {
    const groups = {
      overdue: [],
      today: [],
      tomorrow: [],
      upcoming: {},
    };

    taskList.forEach(t => {
      if (t.dueDate < todayStr && !t.completed) {
        groups.overdue.push(t);
      } else if (t.dueDate === todayStr) {
        groups.today.push(t);
      } else if (t.dueDate === tomorrowStr) {
        groups.tomorrow.push(t);
      } else {
        const d = t.dueDate || 'Unscheduled';
        if (!groups.upcoming[d]) groups.upcoming[d] = [];
        groups.upcoming[d].push(t);
      }
    });

    return groups;
  };

  const dayGroups = groupTasksByDay(filtered);
  const currentCategory = categories.find(c => c.id === activeView);
  const CategoryIcon = currentCategory ? (ICON_MAP[currentCategory.icon] || Folder) : Inbox;

  const formatDateLabel = (dateString) => {
    try {
      const d = new Date(dateString + 'T00:00:00');
      return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="task-list-container">
      {/* Priorities Filter Card */}
      <div className="priorities-card glass-panel">
        <div className="priorities-card-header">
          <SlidersHorizontal size={15} color="#6366f1" />
          <span>Priorities</span>
        </div>

        <div className="filter-pills">
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

        <div className="view-mode-toggle-group desktop-mode-toggle">
          <button
            className={`btn-mode-pill ${viewMode === 'day-split' ? 'active' : ''}`}
            onClick={() => setViewMode('day-split')}
            title="Group tasks by day timeline"
          >
            <CalendarDays size={14} /> Day Split
          </button>
          <button
            className={`btn-mode-pill ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="Display flat task list"
          >
            <ListFilter size={14} /> List
          </button>
        </div>
      </div>

      {/* Task Rendering */}
      {filtered.length > 0 ? (
        viewMode === 'list' ? (
          /* Standard Flat List View */
          <div className="task-cards-grid">
            {filtered.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
          /* Day-Wise Split 2-Column Grid View (Matches Hand-Drawn Sketch) */
          <div className="day-split-container">
            {/* Overdue Section */}
            {dayGroups.overdue.length > 0 && (
              <div className="day-group-section overdue-group">
                <div className="day-group-header">
                  <div className="day-title-left">
                    <AlertCircle size={18} color="#ef4444" />
                    <h3>Overdue Tasks</h3>
                  </div>
                  <span className="day-count-badge badge-overdue">{dayGroups.overdue.length} Tasks</span>
                </div>
                <div className="day-tasks-grid mobile-2col-grid">
                  {dayGroups.overdue.map(t => (
                    <TaskItem key={t.id} task={t} />
                  ))}
                </div>
              </div>
            )}

            {/* Today Section */}
            <div className="day-group-section today-group">
              <div className="day-group-header">
                <div className="day-title-left">
                  <Sun size={18} color="#f59e0b" />
                  <h3>Today — Day wise</h3>
                </div>
                <span className="day-count-badge badge-today">{dayGroups.today.length} Tasks</span>
              </div>

              {/* 2x2 Grid Layout for Mobile (Task 1, Task 2, Task 3, Task 4) */}
              <div className="day-tasks-grid mobile-2col-grid">
                {dayGroups.today.length > 0 ? (
                  dayGroups.today.map(t => (
                    <TaskItem key={t.id} task={t} />
                  ))
                ) : (
                  <p className="day-empty-hint">No tasks scheduled for Today yet. Click '+' to add a task!</p>
                )}
              </div>
            </div>

            {/* Next Day task Section */}
            <div className="day-group-section tomorrow-group">
              <div className="day-group-header">
                <div className="day-title-left">
                  <Calendar size={18} color="#06b6d4" />
                  <h3>Next Day task</h3>
                </div>
                <span className="day-count-badge badge-tomorrow">{dayGroups.tomorrow.length} Tasks</span>
              </div>
              <div className="day-tasks-grid mobile-2col-grid">
                {dayGroups.tomorrow.length > 0 ? (
                  dayGroups.tomorrow.map(t => (
                    <TaskItem key={t.id} task={t} />
                  ))
                ) : (
                  <p className="day-empty-hint">No tasks scheduled for Next Day.</p>
                )}
              </div>
            </div>

            {/* Upcoming Days Section */}
            {Object.keys(dayGroups.upcoming).map(dateKey => (
              <div key={dateKey} className="day-group-section upcoming-day-group">
                <div className="day-group-header">
                  <div className="day-title-left">
                    <Clock size={18} color="#a855f7" />
                    <h3>{formatDateLabel(dateKey)}</h3>
                  </div>
                  <span className="day-count-badge">{dayGroups.upcoming[dateKey].length} Tasks</span>
                </div>
                <div className="day-tasks-grid mobile-2col-grid">
                  {dayGroups.upcoming[dateKey].map(t => (
                    <TaskItem key={t.id} task={t} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Empty State UI */
        <div className="empty-state glass-panel">
          <div className="empty-icon-wrap" style={{ backgroundColor: currentCategory ? `${currentCategory.color}20` : 'rgba(99, 102, 241, 0.15)' }}>
            <CategoryIcon size={44} color={currentCategory ? currentCategory.color : '#6366f1'} />
          </div>
          <h3>No pending tasks in {currentCategory ? currentCategory.name : 'this view'}</h3>
          <p>
            {searchQuery
              ? `No matches found for "${searchQuery}". Try adjusting search terms or filters.`
              : `You are all caught up! Click '+' below to create a task.`}
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

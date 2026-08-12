import React, { useRef, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import { Search, ArrowUpDown, Flame, Plus, X, Zap, Trophy, Menu } from 'lucide-react';

const MOTIVATIONAL_QUOTES = [
  "Small daily steps lead to massive lifetime achievements. ⚡",
  "Focus on being productive instead of busy. 🔥",
  "Your future self will thank you for taking action now. 🚀",
  "Done is better than perfect. Keep building momentum! ✨",
  "Discipline turns intent into extraordinary results. 🏆"
];

export const Header = ({ activeTab }) => {
  const {
    tasks,
    activeView,
    categories,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    streakData,
    setActiveModalTask,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useTask();

  const searchInputRef = useRef(null);
  const randomQuote = MOTIVATIONAL_QUOTES[0];

  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const percentDone = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getViewTitle = () => {
    if (activeTab === 'stats') return 'Productivity Analytics';
    if (activeTab === 'habits') return 'Daily Habit Tracker';
    switch (activeView) {
      case 'inbox': return 'Inbox — All Tasks';
      case 'today': return "Today's Agenda";
      case 'upcoming': return 'Upcoming Schedule';
      case 'starred': return 'Starred & High Priority';
      case 'completed': return 'Completed Wins';
      default:
        const cat = categories.find(c => c.id === activeView);
        return cat ? `${cat.name}` : 'Task Workspace';
    }
  };

  return (
    <div className="header-wrapper">
      {/* Mobile Top Bar */}
      <div className="mobile-top-bar">
        <button
          className="btn-icon mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          title="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <span className="mobile-app-title">TaskPulse PRO</span>
        <button className="btn btn-primary btn-sm mobile-add-btn" onClick={() => setActiveModalTask('new')}>
          <Plus size={16} /> Task
        </button>
      </div>

      {/* Motivational Hero Banner */}
      <div className="hero-banner glass-panel">
        <div className="hero-content">
          <div className="hero-tag">
            <Zap size={14} color="#f59e0b" />
            <span>DAILY MOTIVATION</span>
          </div>
          <h2>Ready to conquer your goals, Champion? 🚀</h2>
          <p className="hero-quote">"{randomQuote}"</p>
        </div>

        {/* Hero Progress Widget */}
        <div className="hero-progress-card">
          <div className="hero-progress-text">
            <div className="progress-info-head">
              <Trophy size={16} color="#6366f1" />
              <span>Today's Completion</span>
            </div>
            <span className="hero-percent">{percentDone}%</span>
          </div>
          <div className="hero-bar-bg">
            <div className="hero-bar-fill" style={{ width: `${percentDone}%` }} />
          </div>
          <span className="hero-subtext">{completedCount} of {totalCount} completed</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <header className="app-header">
        <div className="header-title-area">
          <h1>{getViewTitle()}</h1>
        </div>

        <div className="header-controls">
          <div className="search-bar-container">
            <Search size={16} className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search tasks or tags... ('/' to focus)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
                <X size={14} />
              </button>
            )}
          </div>

          {activeTab === 'tasks' && (
            <div className="sort-container">
              <ArrowUpDown size={15} className="sort-icon" />
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="dueDate">Sort: Due Date</option>
                <option value="priority">Sort: Priority</option>
                <option value="created">Sort: Recently Added</option>
                <option value="alphabetical">Sort: Title (A-Z)</option>
              </select>
            </div>
          )}

          <div className="streak-badge" title="Real Daily Productivity Streak">
            <Flame size={18} className="flame-icon" />
            <span className="streak-num">{streakData.count} Day Streak</span>
          </div>

          <button
            className="btn btn-primary desktop-add-btn"
            onClick={() => setActiveModalTask('new')}
          >
            <Plus size={18} />
            <span>Add Task</span>
          </button>
        </div>
      </header>
    </div>
  );
};

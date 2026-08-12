import React, { useRef, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import { Search, ArrowUpDown, Flame, Plus, X, Zap, Trophy, Menu, ShieldCheck } from 'lucide-react';

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
    setIsMobileMenuOpen,
    currentUserEmail,
    setIsAuthModalOpen
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
      case 'inbox': return 'Inbox — All tasks';
      case 'today': return "Today — Day wise";
      case 'day-schedule': return 'Day-Wise Schedule';
      case 'upcoming': return 'Next Day task';
      case 'starred': return 'Starred & High Priority';
      case 'completed': return 'Completed Wins';
      default:
        const cat = categories.find(c => c.id === activeView);
        return cat ? `${cat.name}` : 'Task Workspace';
    }
  };

  return (
    <div className="header-wrapper">
      {/* Top Mobile Bar (Menu Icon Left | TaskPulse PRO Right) */}
      <div className="mobile-top-bar">
        <button
          className="btn-icon mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          title="Toggle Menu"
        >
          <Menu size={22} />
          <span className="mobile-menu-label">Menu</span>
        </button>

        <div className="mobile-brand-title">TaskPulse PRO</div>
      </div>

      {/* Daily Motivation Banner Card (Redesigned Compact & Sleek) */}
      <div className="hero-banner glass-panel hero-compact-mobile">
        <div className="hero-compact-top">
          <div className="hero-tag">
            <Zap size={13} color="#f59e0b" />
            <span>DAILY MOTIVATION</span>
          </div>

          <div className="hero-compact-pct">
            <Trophy size={14} color="#6366f1" />
            <span>{percentDone}% Done</span>
          </div>
        </div>

        <h2 className="hero-compact-heading">Ready to conquer your goals, Champion? 🚀</h2>

        <div className="hero-bar-bg hero-compact-bar">
          <div className="hero-bar-fill" style={{ width: `${percentDone}%` }} />
        </div>
      </div>

      {/* Main View Title & Search/Streak Controls Row */}
      <header className="app-header">
        <div className="header-title-area">
          <h1>{getViewTitle()}</h1>
        </div>

        <div className="header-controls">
          {/* Search section */}
          <div className="search-bar-container">
            <Search size={16} className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search section..."
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
            <div className="sort-container desktop-only-sort">
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

          {/* User Email Account Sync Badge */}
          <button
            className="user-account-badge"
            onClick={() => setIsAuthModalOpen(true)}
            title="Click to Sync Email across devices"
          >
            <ShieldCheck size={15} color="#06b6d4" />
            <span className="user-email-text">{currentUserEmail || 'Sync Email'}</span>
          </button>

          {/* Streak Badge */}
          <div className="streak-badge" title="Real Daily Productivity Streak">
            <Flame size={16} className="flame-icon" />
            <span className="streak-num">{streakData.count} Day Str</span>
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

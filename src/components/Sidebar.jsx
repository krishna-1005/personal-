import React from 'react';
import { useTask } from '../context/TaskContext';
import {
  CheckSquare,
  Inbox,
  Calendar,
  Clock,
  Star,
  CheckCircle2,
  Folder,
  Briefcase,
  User,
  Code,
  Activity,
  DollarSign,
  Plus,
  Timer,
  BarChart2,
  HelpCircle,
  Sun,
  Moon,
  Download,
  Upload,
  Sparkles,
  Award,
  Headphones,
  FileText,
  Layers,
  CalendarDays,
  X
} from 'lucide-react';

const ICON_MAP = {
  Briefcase: Briefcase,
  User: User,
  Code: Code,
  Activity: Activity,
  DollarSign: DollarSign,
  Folder: Folder,
};

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const {
    tasks,
    categories,
    habits,
    activeView,
    setActiveView,
    theme,
    toggleTheme,
    isGuideOpen,
    setIsGuideOpen,
    exportData,
    importData,
    setIsFocusModalOpen,
    setActiveModalTask,
    setIsScratchpadOpen,
    setIsTemplatesOpen,
    setIsAmbientSoundOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useTask();

  const todayStr = new Date().toISOString().split('T')[0];
  
  const inboxCount = tasks.filter(t => !t.completed).length;
  const todayCount = tasks.filter(t => !t.completed && t.dueDate === todayStr).length;
  const upcomingCount = tasks.filter(t => !t.completed && t.dueDate > todayStr).length;
  const starredCount = tasks.filter(t => t.starred).length;
  const completedCount = tasks.filter(t => t.completed).length;
  const habitsDone = habits.filter(h => h.completedToday).length;

  const handleNavClick = (tab, view) => {
    setActiveTab(tab);
    if (view) setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => importData(event.target.result);
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <aside className={`sidebar-container glass-panel ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Sparkles className="icon-pulse" size={24} color="#6366f1" />
          </div>
          <div className="brand-text">
            <h2>TaskPulse</h2>
            <span className="version-badge">PRO v4.0</span>
          </div>
          {isMobileMenuOpen && (
            <button className="btn-icon mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={20} />
            </button>
          )}
        </div>

        {/* Quick Action Button */}
        <div className="sidebar-action">
          <button className="btn btn-primary create-task-btn" onClick={() => { setActiveModalTask('new'); setIsMobileMenuOpen(false); }}>
            <Plus size={18} />
            <span>New Task</span>
            <kbd>N</kbd>
          </button>
        </div>

        {/* Scrollable Nav Items */}
        <div className="sidebar-nav-scroll">
          <div className="nav-group">
            <span className="nav-group-title">VIEWS & AGENDA</span>
            
            <button
              className={`nav-item ${activeTab === 'tasks' && activeView === 'inbox' ? 'active' : ''}`}
              onClick={() => handleNavClick('tasks', 'inbox')}
            >
              <Inbox size={18} />
              <span>All Tasks</span>
              {inboxCount > 0 && <span className="nav-count">{inboxCount}</span>}
            </button>

            <button
              className={`nav-item ${activeTab === 'tasks' && activeView === 'day-schedule' ? 'active' : ''}`}
              onClick={() => handleNavClick('tasks', 'day-schedule')}
            >
              <CalendarDays size={18} color="#06b6d4" />
              <span>Day-Wise Schedule</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'tasks' && activeView === 'today' ? 'active' : ''}`}
              onClick={() => handleNavClick('tasks', 'today')}
            >
              <Calendar size={18} />
              <span>Today</span>
              {todayCount > 0 && <span className="nav-count badge-today">{todayCount}</span>}
            </button>

            <button
              className={`nav-item ${activeTab === 'habits' ? 'active' : ''}`}
              onClick={() => handleNavClick('habits')}
            >
              <Award size={18} color="#f59e0b" />
              <span>Daily Habits</span>
              <span className="nav-count">{habitsDone}/{habits.length}</span>
            </button>

            <button
              className={`nav-item ${activeTab === 'tasks' && activeView === 'upcoming' ? 'active' : ''}`}
              onClick={() => handleNavClick('tasks', 'upcoming')}
            >
              <Clock size={18} />
              <span>Upcoming</span>
              {upcomingCount > 0 && <span className="nav-count">{upcomingCount}</span>}
            </button>

            <button
              className={`nav-item ${activeTab === 'tasks' && activeView === 'starred' ? 'active' : ''}`}
              onClick={() => handleNavClick('tasks', 'starred')}
            >
              <Star size={18} className="star-icon" />
              <span>Starred</span>
              {starredCount > 0 && <span className="nav-count">{starredCount}</span>}
            </button>

            <button
              className={`nav-item ${activeTab === 'tasks' && activeView === 'completed' ? 'active' : ''}`}
              onClick={() => handleNavClick('tasks', 'completed')}
            >
              <CheckCircle2 size={18} />
              <span>Completed</span>
              {completedCount > 0 && <span className="nav-count">{completedCount}</span>}
            </button>
          </div>

          <div className="nav-group">
            <div className="nav-group-header">
              <span className="nav-group-title">CATEGORIES</span>
            </div>

            {categories.map((cat) => {
              const IconComp = ICON_MAP[cat.icon] || Folder;
              const catCount = tasks.filter(t => t.category === cat.id && !t.completed).length;
              const isActive = activeTab === 'tasks' && activeView === cat.id;

              return (
                <button
                  key={cat.id}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavClick('tasks', cat.id)}
                >
                  <span className="category-dot" style={{ backgroundColor: cat.color }} />
                  <IconComp size={16} style={{ color: cat.color }} />
                  <span className="nav-label">{cat.name}</span>
                  {catCount > 0 && <span className="nav-count">{catCount}</span>}
                </button>
              );
            })}
          </div>

          <div className="nav-group">
            <span className="nav-group-title">POWER TOOLS</span>

            <button className="nav-item" onClick={() => { setIsAmbientSoundOpen(true); setIsMobileMenuOpen(false); }}>
              <Headphones size={18} color="#06b6d4" />
              <span>Focus Soundscapes</span>
            </button>

            <button className="nav-item" onClick={() => { setIsScratchpadOpen(true); setIsMobileMenuOpen(false); }}>
              <FileText size={18} color="#f59e0b" />
              <span>Brain Dump Notes</span>
            </button>

            <button className="nav-item" onClick={() => { setIsTemplatesOpen(true); setIsMobileMenuOpen(false); }}>
              <Layers size={18} color="#a855f7" />
              <span>Workflow Presets</span>
            </button>

            <button className="nav-item focus-btn" onClick={() => { setIsFocusModalOpen(true); setIsMobileMenuOpen(false); }}>
              <Timer size={18} color="#ec4899" />
              <span>Pomodoro Timer</span>
            </button>

            <button className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => handleNavClick('stats')}>
              <BarChart2 size={18} color="#10b981" />
              <span>Analytics</span>
            </button>

            <button className={`nav-item guide-btn ${isGuideOpen ? 'active-guide' : ''}`} onClick={() => { setIsGuideOpen(!isGuideOpen); setIsMobileMenuOpen(false); }}>
              <HelpCircle size={18} color="#f59e0b" />
              <span>Guide Me</span>
            </button>
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="btn-icon theme-toggle" onClick={toggleTheme} title="Toggle Dark/Light Mode">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="btn-icon" onClick={exportData} title="Export Tasks (JSON Backup)">
            <Download size={18} />
          </button>
          <button className="btn-icon" onClick={handleImportClick} title="Import Tasks (JSON Restore)">
            <Upload size={18} />
          </button>
        </div>
      </aside>
    </>
  );
};

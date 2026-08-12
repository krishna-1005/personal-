import React from 'react';
import { useTask } from '../context/TaskContext';
import { Inbox, Calendar, CalendarDays, Award, Menu, Plus } from 'lucide-react';

export const MobileBottomNav = ({ activeTab, setActiveTab }) => {
  const {
    tasks,
    habits,
    activeView,
    setActiveView,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setActiveModalTask
  } = useTask();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = tasks.filter(t => !t.completed && t.dueDate === todayStr).length;

  const handleNav = (tab, view) => {
    setActiveTab(tab);
    if (view) setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Floating Action Button (+ Task) on Mobile */}
      <button
        className="mobile-fab-btn"
        onClick={() => setActiveModalTask('new')}
        title="Create New Task"
      >
        <Plus size={24} color="#ffffff" />
      </button>

      {/* Relaxed Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <button
          className={`mobile-nav-pill ${activeTab === 'tasks' && activeView === 'inbox' ? 'active' : ''}`}
          onClick={() => handleNav('tasks', 'inbox')}
        >
          <Inbox size={20} />
          <span>Tasks</span>
        </button>

        <button
          className={`mobile-nav-pill ${activeTab === 'tasks' && activeView === 'today' ? 'active' : ''}`}
          onClick={() => handleNav('tasks', 'today')}
        >
          <Calendar size={20} />
          <span>Today</span>
          {todayCount > 0 && <span className="mobile-badge">{todayCount}</span>}
        </button>

        <button
          className={`mobile-nav-pill ${activeTab === 'tasks' && activeView === 'day-schedule' ? 'active' : ''}`}
          onClick={() => handleNav('tasks', 'day-schedule')}
        >
          <CalendarDays size={20} />
          <span>Timeline</span>
        </button>

        <button
          className={`mobile-nav-pill ${activeTab === 'habits' ? 'active' : ''}`}
          onClick={() => handleNav('habits')}
        >
          <Award size={20} />
          <span>Habits</span>
        </button>

        <button
          className={`mobile-nav-pill ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu size={20} />
          <span>Menu</span>
        </button>
      </nav>
    </>
  );
};

import React from 'react';
import { useTask } from '../context/TaskContext';
import { CheckCircle2, Flame, Clock, Award, BarChart2, PieChart, Layers } from 'lucide-react';

export const StatsDashboard = () => {
  const { tasks, categories, focusStats } = useTask();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="stats-dashboard-container">
      {/* Top Metrics Cards Grid */}
      <div className="stats-cards-grid">
        {/* Completion Rate Card */}
        <div className="stat-card glass-panel">
          <div className="stat-header">
            <div className="stat-icon-wrap icon-indigo">
              <CheckCircle2 size={22} />
            </div>
            <span className="stat-title">Completion Rate</span>
          </div>
          <div className="stat-main-value">
            <span className="value-num">{completionRate}%</span>
            <span className="sub-label">{completedTasks} of {totalTasks} tasks done</span>
          </div>
          <div className="stat-progress-bar">
            <div className="stat-progress-fill fill-indigo" style={{ width: `${completionRate}%` }} />
          </div>
        </div>

        {/* Focus Streak Card */}
        <div className="stat-card glass-panel">
          <div className="stat-header">
            <div className="stat-icon-wrap icon-amber">
              <Flame size={22} />
            </div>
            <span className="stat-title">Active Streak</span>
          </div>
          <div className="stat-main-value">
            <span className="value-num">{focusStats.streakDays} Days</span>
            <span className="sub-label">Consistent task completion</span>
          </div>
          <div className="streak-stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`streak-star ${i < focusStats.streakDays ? 'lit' : ''}`}>★</span>
            ))}
          </div>
        </div>

        {/* Focused Time Card */}
        <div className="stat-card glass-panel">
          <div className="stat-header">
            <div className="stat-icon-wrap icon-cyan">
              <Clock size={22} />
            </div>
            <span className="stat-title">Focus Time Logged</span>
          </div>
          <div className="stat-main-value">
            <span className="value-num">{focusStats.totalFocusMinutes} Mins</span>
            <span className="sub-label">{focusStats.completedSessions} Pomodoro sessions</span>
          </div>
        </div>

        {/* Total Tasks Stat */}
        <div className="stat-card glass-panel">
          <div className="stat-header">
            <div className="stat-icon-wrap icon-purple">
              <Layers size={22} />
            </div>
            <span className="stat-title">Pending Tasks</span>
          </div>
          <div className="stat-main-value">
            <span className="value-num">{pendingTasks}</span>
            <span className="sub-label">Tasks currently in queue</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown Section */}
      <div className="category-breakdown-section glass-panel">
        <div className="section-title-wrap">
          <PieChart size={20} color="#6366f1" />
          <h3>Category Task Distribution</h3>
        </div>

        <div className="category-bars-list">
          {categories.map(cat => {
            const catTotal = tasks.filter(t => t.category === cat.id).length;
            const catDone = tasks.filter(t => t.category === cat.id && t.completed).length;
            const catPercent = catTotal > 0 ? Math.round((catDone / catTotal) * 100) : 0;

            return (
              <div key={cat.id} className="category-bar-item">
                <div className="cat-bar-header">
                  <div className="cat-info">
                    <span className="cat-dot" style={{ backgroundColor: cat.color }} />
                    <span className="cat-name">{cat.name}</span>
                  </div>
                  <span className="cat-counts">{catDone}/{catTotal} completed ({catPercent}%)</span>
                </div>
                <div className="cat-progress-bg">
                  <div
                    className="cat-progress-fill"
                    style={{ width: `${catPercent}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { Flame, Plus, CheckCircle2, Circle, Trash2, Award } from 'lucide-react';

export const HabitsTracker = () => {
  const { habits, toggleHabit, addHabit, deleteHabit } = useTask();
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    addHabit(newHabitTitle);
    setNewHabitTitle('');
    setShowAddForm(false);
  };

  const completedCount = habits.filter(h => h.completedToday).length;

  return (
    <div className="habits-widget glass-panel">
      <div className="habits-header">
        <div className="habits-title-wrap">
          <Award size={18} color="#f59e0b" />
          <h3>Daily Habit Streaks</h3>
          <span className="habits-count-badge">{completedCount}/{habits.length} Done</span>
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={14} /> Add Habit
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="add-habit-form">
          <input
            type="text"
            className="form-input habit-input"
            placeholder="e.g., Drink 2L Water 💧 or 15-Min Meditation 🧘"
            value={newHabitTitle}
            onChange={(e) => setNewHabitTitle(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn btn-primary btn-sm">Save</button>
        </form>
      )}

      <div className="habits-grid">
        {habits.map(habit => (
          <div
            key={habit.id}
            className={`habit-card ${habit.completedToday ? 'habit-done' : ''}`}
            onClick={() => toggleHabit(habit.id)}
          >
            <div className="habit-check">
              {habit.completedToday ? (
                <CheckCircle2 size={20} color="#10b981" />
              ) : (
                <Circle size={20} color="#64748b" />
              )}
            </div>

            <div className="habit-info">
              <span className="habit-title">{habit.title}</span>
              <div className="habit-streak">
                <Flame size={12} color="#f59e0b" />
                <span>{habit.streak} day streak</span>
              </div>
            </div>

            <button
              className="btn-icon delete-habit-btn"
              onClick={(e) => {
                e.stopPropagation();
                deleteHabit(habit.id);
              }}
              title="Delete Habit"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

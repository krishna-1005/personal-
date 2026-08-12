import React, { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import { Play, Pause, RotateCcw, X, CheckCircle2, Flame, Sparkles } from 'lucide-react';

const TIMER_MODES = {
  work: { label: 'Work Focus', duration: 25 * 60, color: '#6366f1' },
  shortBreak: { label: 'Short Break', duration: 5 * 60, color: '#10b981' },
  longBreak: { label: 'Long Break', duration: 15 * 60, color: '#06b6d4' }
};

export const FocusMode = () => {
  const {
    isFocusModalOpen,
    setIsFocusModalOpen,
    focusTask,
    setFocusTask,
    logFocusSession,
    toggleTaskComplete
  } = useTask();

  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES.work.duration);
  const [isRunning, setIsRunning] = useState(false);

  // Play audio chime using Web Audio API synth (no external audio assets needed!)
  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5 note
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.log('Audio playback unavailable');
    }
  };

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playChime();
      if (mode === 'work') {
        logFocusSession(25);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, logFocusSession]);

  if (!isFocusModalOpen) return null;

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(TIMER_MODES[newMode].duration);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_MODES[mode].duration);
  };

  // Compute progress percentage
  const totalDuration = TIMER_MODES[mode].duration;
  const progressPercent = Math.round(((totalDuration - timeLeft) / totalDuration) * 100);

  // Format MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="modal-overlay focus-modal-overlay" onClick={() => setIsFocusModalOpen(false)}>
      <div className="modal-content focus-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="focus-header-title">
            <Sparkles size={20} color="#a855f7" />
            <h2>Focus Session</h2>
          </div>
          <button className="btn-icon" onClick={() => setIsFocusModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Focus Mode Selector */}
        <div className="focus-mode-tabs">
          {Object.keys(TIMER_MODES).map((key) => (
            <button
              key={key}
              className={`focus-tab ${mode === key ? 'active' : ''}`}
              style={{ '--tab-color': TIMER_MODES[key].color }}
              onClick={() => handleModeChange(key)}
            >
              {TIMER_MODES[key].label}
            </button>
          ))}
        </div>

        {/* Focused Task Card */}
        {focusTask && (
          <div className="focused-task-banner glass-panel">
            <div className="task-banner-text">
              <span className="banner-label">CURRENT TARGET:</span>
              <p>{focusTask.title}</p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                toggleTaskComplete(focusTask.id);
                setFocusTask(null);
              }}
            >
              <CheckCircle2 size={15} color="#10b981" /> Complete
            </button>
          </div>
        )}

        {/* Big Circular Timer Display */}
        <div className="timer-ring-container">
          <svg className="timer-svg" viewBox="0 0 200 200">
            <circle
              className="timer-ring-bg"
              cx="100"
              cy="100"
              r="85"
            />
            <circle
              className="timer-ring-fill"
              cx="100"
              cy="100"
              r="85"
              style={{
                strokeDasharray: 534,
                strokeDashoffset: 534 - (534 * progressPercent) / 100,
                stroke: TIMER_MODES[mode].color
              }}
            />
          </svg>
          <div className="timer-text-display">
            <span className="time-digits">{formatTime(timeLeft)}</span>
            <span className="mode-status">{isRunning ? 'FOCUSING' : 'PAUSED'}</span>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="timer-controls">
          <button className="btn-icon btn-lg" onClick={resetTimer} title="Reset Timer">
            <RotateCcw size={22} />
          </button>

          <button
            className="btn btn-primary btn-xl timer-play-btn"
            style={{ backgroundColor: TIMER_MODES[mode].color }}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: 4 }} />}
          </button>
        </div>
      </div>
    </div>
  );
};

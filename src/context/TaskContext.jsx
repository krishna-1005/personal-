import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const TaskContext = createContext();

const DEFAULT_PUNISHMENTS = [
  {
    id: 'p-1',
    title: '💪 20 Pushups / Jumping Jacks Challenge',
    description: 'Get your blood pumping right now to shake off lethargy and boost focus!',
    icon: 'Dumbbell'
  },
  {
    id: 'p-2',
    title: '📵 1-Hour Social Media & Distraction Detox',
    description: 'Close Instagram, YouTube, and X for the next 60 minutes. Deep work only.',
    icon: 'PhoneOff'
  },
  {
    id: 'p-3',
    title: '❄️ Cold Face Splash & 2 Glasses of Water',
    description: 'Hydrate immediately and splash cold water on your face to re-energize.',
    icon: 'Droplets'
  },
  {
    id: 'p-4',
    title: '✍️ Write 3 Sentences on Why You Procrastinated',
    description: 'Reflect honestly in the scratchpad notes: What distracted you and how will you fix it?',
    icon: 'Edit3'
  },
  {
    id: 'p-5',
    title: '⏱️ 10-Minute Instant Redemption Sprint',
    description: 'Set a 10-minute timer right now and finish the core subtask without stopping!',
    icon: 'Zap'
  }
];

const DEFAULT_CATEGORIES = [
  { id: 'work', name: 'Work & Career', color: '#6366f1', icon: 'Briefcase' },
  { id: 'personal', name: 'Personal Life', color: '#06b6d4', icon: 'User' },
  { id: 'code', name: 'Dev & Projects', color: '#a855f7', icon: 'Code' },
  { id: 'health', name: 'Health & Fitness', color: '#10b981', icon: 'Activity' },
  { id: 'finance', name: 'Finance & Goals', color: '#f59e0b', icon: 'DollarSign' },
];

const DEFAULT_HABITS = [
  { id: 'h-1', title: 'Drink 2L Water 💧', streak: 0, completedToday: false, history: [] },
  { id: 'h-2', title: 'Read 20 Pages 📚', streak: 0, completedToday: false, history: [] },
  { id: 'h-3', title: '30-Min Gym Workout 🏋️', streak: 0, completedToday: false, history: [] },
  { id: 'h-4', title: 'Code / Learn New Skill 💻', streak: 0, completedToday: false, history: [] }
];

const SAMPLE_TASKS = [
  {
    id: 'task-1',
    title: 'Design TaskPulse Pro UI Components',
    description: 'Build sleek glassmorphism sidebar, task cards, and Pomodoro widget with custom CSS.',
    category: 'code',
    priority: 'high',
    dueDate: new Date().toISOString().split('T')[0],
    linkUrl: 'https://github.com',
    completed: false,
    starred: true,
    tags: ['UI/UX', 'React'],
    estimatedTime: 25,
    subtasks: [
      { id: 'sub-1', title: 'Create index.css design tokens', completed: false },
      { id: 'sub-2', title: 'Implement TaskCard micro-animations', completed: false }
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Review Weekly Fitness & Meal Prep Plan',
    description: 'Schedule gym workouts for Mon/Wed/Fri and prepare high-protein meals.',
    category: 'health',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    linkUrl: 'https://youtube.com',
    completed: false,
    starred: false,
    tags: ['Fitness'],
    estimatedTime: 15,
    subtasks: [],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  }
];

export const TaskProvider = ({ children }) => {
  const [currentUserEmail, setCurrentUserEmail] = useState(() => {
    return localStorage.getItem('taskpulse_user_email') || 'krishkulkarni1005@gmail.com';
  });

  const [cloudSyncId, setCloudSyncId] = useState(() => {
    return localStorage.getItem('taskpulse_cloud_sync_id') || '';
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState(null);

  const getUserStorageKey = (email) => {
    const clean = (email || 'default').toLowerCase().replace(/[^a-z0-9]/g, '_');
    return `taskpulse_cloud_user_${clean}`;
  };

  const [tasks, setTasks] = useState(() => {
    const email = localStorage.getItem('taskpulse_user_email') || 'krishkulkarni1005@gmail.com';
    const key = `taskpulse_cloud_user_${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const userCloudData = localStorage.getItem(key);
    if (userCloudData) {
      try {
        const parsed = JSON.parse(userCloudData);
        if (parsed.tasks) return parsed.tasks;
      } catch (e) {}
    }
    const saved = localStorage.getItem('taskpulse_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return SAMPLE_TASKS;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('taskpulse_categories');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_CATEGORIES;
  });

  const [habits, setHabits] = useState(() => {
    const email = localStorage.getItem('taskpulse_user_email') || 'krishkulkarni1005@gmail.com';
    const key = `taskpulse_cloud_user_${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const userCloudData = localStorage.getItem(key);
    if (userCloudData) {
      try {
        const parsed = JSON.parse(userCloudData);
        if (parsed.habits) return parsed.habits;
      } catch (e) {}
    }
    const saved = localStorage.getItem('taskpulse_habits');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_HABITS;
  });

  const [streakData, setStreakData] = useState(() => {
    const email = localStorage.getItem('taskpulse_user_email') || 'krishkulkarni1005@gmail.com';
    const key = `taskpulse_cloud_user_${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const userCloudData = localStorage.getItem(key);
    if (userCloudData) {
      try {
        const parsed = JSON.parse(userCloudData);
        if (parsed.streakData) return parsed.streakData;
      } catch (e) {}
    }
    const saved = localStorage.getItem('taskpulse_streak_engine');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed;
      } catch (e) {}
    }
    return { count: 0, lastCompletedDate: null, celebratedToday: false };
  });

  const [activePunishment, setActivePunishment] = useState(null);
  const [punishmentTargetTask, setPunishmentTargetTask] = useState(null);
  const [punishmentLog, setPunishmentLog] = useState(() => {
    const saved = localStorage.getItem('taskpulse_punishments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [runningTaskId, setRunningTaskId] = useState(null);
  const [activeTimerSeconds, setActiveTimerSeconds] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [alarmTask, setAlarmTask] = useState(null);

  const alarmAudioIntervalRef = useRef(null);

  const [scratchpad, setScratchpad] = useState(() => {
    return localStorage.getItem('taskpulse_scratchpad') || '💡 Brain Dump & Quick Notes:\n- Call bank regarding card update\n- Read Atomic Habits';
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('taskpulse_theme') || 'dark';
  });

  const [activeView, setActiveView] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [selectedTag, setSelectedTag] = useState(null);

  const [focusStats, setFocusStats] = useState(() => {
    const saved = localStorage.getItem('taskpulse_focus_stats');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return { totalFocusMinutes: 0, completedSessions: 0 };
  });

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [activeModalTask, setActiveModalTask] = useState(null);
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [focusTask, setFocusTask] = useState(null);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isAmbientSoundOpen, setIsAmbientSoundOpen] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [celebratedStreakNum, setCelebratedStreakNum] = useState(0);

  // Check URL params for syncId on initial load (e.g. personal-lilac-eta.vercel.app?syncId=xxx)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const syncParam = urlParams.get('syncId');
    if (syncParam) {
      connectCloudSyncId(syncParam.trim());
    }
  }, []);

  // Save local storage backup
  const saveUserDataToLocal = (emailToSave) => {
    const email = emailToSave || currentUserEmail;
    if (!email) return;
    const key = getUserStorageKey(email);
    const payload = {
      email,
      lastSyncedAt: new Date().toISOString(),
      tasks,
      categories,
      habits,
      streakData,
      scratchpad,
      focusStats,
      punishmentLog
    };
    localStorage.setItem(key, JSON.stringify(payload));
    localStorage.setItem('taskpulse_tasks', JSON.stringify(tasks));
    localStorage.setItem('taskpulse_categories', JSON.stringify(categories));
    localStorage.setItem('taskpulse_habits', JSON.stringify(habits));
    localStorage.setItem('taskpulse_streak_engine', JSON.stringify(streakData));
    localStorage.setItem('taskpulse_scratchpad', scratchpad);
  };

  // Real-time Cloud REST Push (Desktop/Mobile to Cloud API)
  const pushToOnlineCloud = async (targetSyncId = cloudSyncId) => {
    if (!targetSyncId) return;
    try {
      setIsSyncing(true);
      const payload = {
        email: currentUserEmail,
        updatedAt: Date.now(),
        tasks,
        categories,
        habits,
        streakData,
        scratchpad,
        focusStats,
        punishmentLog
      };

      await fetch(`https://api.restful-api.dev/objects/${targetSyncId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `taskpulse_${currentUserEmail}`, data: payload })
      });
      setLastSyncedTime(new Date().toLocaleTimeString());
    } catch (e) {
      console.error('Cloud Push Error:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Real-time Cloud REST Pull (Download latest tasks across devices)
  const pullFromOnlineCloud = async (targetSyncId = cloudSyncId) => {
    if (!targetSyncId) return false;
    try {
      setIsSyncing(true);
      const res = await fetch(`https://api.restful-api.dev/objects/${targetSyncId}`);
      if (!res.ok) return false;
      const record = await res.json();
      if (record && record.data) {
        const cloudData = record.data;
        if (cloudData.tasks) setTasks(cloudData.tasks);
        if (cloudData.categories) setCategories(cloudData.categories);
        if (cloudData.habits) setHabits(cloudData.habits);
        if (cloudData.streakData) setStreakData(cloudData.streakData);
        if (cloudData.scratchpad) setScratchpad(cloudData.scratchpad);
        if (cloudData.focusStats) setFocusStats(cloudData.focusStats);
        if (cloudData.punishmentLog) setPunishmentLog(cloudData.punishmentLog);
        setLastSyncedTime(new Date().toLocaleTimeString());
        return true;
      }
    } catch (e) {
      console.error('Cloud Pull Error:', e);
    } finally {
      setIsSyncing(false);
    }
    return false;
  };

  // Connect or initialize Cloud Sync ID for cross-device sync
  const connectCloudSyncId = async (existingSyncId) => {
    if (existingSyncId) {
      localStorage.setItem('taskpulse_cloud_sync_id', existingSyncId);
      setCloudSyncId(existingSyncId);
      const success = await pullFromOnlineCloud(existingSyncId);
      if (success) return true;
    }

    // Create a new record if none provided or invalid
    try {
      setIsSyncing(true);
      const initialPayload = {
        email: currentUserEmail,
        updatedAt: Date.now(),
        tasks,
        categories,
        habits,
        streakData,
        scratchpad,
        focusStats,
        punishmentLog
      };

      const res = await fetch('https://api.restful-api.dev/objects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `taskpulse_${currentUserEmail}`, data: initialPayload })
      });

      const newObj = await res.json();
      if (newObj && newObj.id) {
        localStorage.setItem('taskpulse_cloud_sync_id', newObj.id);
        setCloudSyncId(newObj.id);
        setLastSyncedTime(new Date().toLocaleTimeString());
        return newObj.id;
      }
    } catch (e) {
      console.error('Cloud Connect Error:', e);
    } finally {
      setIsSyncing(false);
    }
    return false;
  };

  // Auto Push changes locally and to cloud
  useEffect(() => {
    saveUserDataToLocal();
    if (cloudSyncId) {
      const timer = setTimeout(() => {
        pushToOnlineCloud(cloudSyncId);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [tasks, categories, habits, streakData, scratchpad, focusStats, currentUserEmail]);

  // Periodic Cloud Sync Poll every 6 seconds to keep Mobile and Desktop 100% in sync
  useEffect(() => {
    if (!cloudSyncId) {
      connectCloudSyncId();
      return;
    }

    const pollInterval = setInterval(() => {
      pullFromOnlineCloud(cloudSyncId);
    }, 6000);

    return () => clearInterval(pollInterval);
  }, [cloudSyncId]);

  useEffect(() => {
    localStorage.setItem('taskpulse_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Login with Email ID (Pulls user data across devices/browsers)
  const loginWithEmail = async (email) => {
    const normalized = email.trim().toLowerCase();
    localStorage.setItem('taskpulse_user_email', normalized);
    setCurrentUserEmail(normalized);

    // Save local
    saveUserDataToLocal(normalized);

    // Connect cloud record for this email
    await connectCloudSyncId();
    return true;
  };

  const logoutUser = () => {
    setCurrentUserEmail('');
    setCloudSyncId('');
    localStorage.removeItem('taskpulse_user_email');
    localStorage.removeItem('taskpulse_cloud_sync_id');
  };

  const syncDataCloud = async () => {
    if (!cloudSyncId) {
      await connectCloudSyncId();
    } else {
      await pushToOnlineCloud();
      await pullFromOnlineCloud();
    }
  };

  const triggerPunishmentForMissedTask = (missedTask) => {
    const randomIndex = Math.floor(Math.random() * DEFAULT_PUNISHMENTS.length);
    const chosenPunishment = DEFAULT_PUNISHMENTS[randomIndex];
    setActivePunishment(chosenPunishment);
    setPunishmentTargetTask(missedTask);
    setStreakData(prev => ({ ...prev, count: 0 }));
  };

  const acceptAndCompletePunishment = () => {
    if (activePunishment && punishmentTargetTask) {
      setPunishmentLog(prev => [
        {
          id: `p-log-${Date.now()}`,
          punishmentTitle: activePunishment.title,
          missedTaskTitle: punishmentTargetTask.title,
          completedAt: new Date().toISOString()
        },
        ...prev
      ]);
    }
    setActivePunishment(null);
    setPunishmentTargetTask(null);
  };

  useEffect(() => {
    let timer = null;
    if (runningTaskId && !isTimerPaused && activeTimerSeconds > 0) {
      timer = setInterval(() => {
        setActiveTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (runningTaskId && activeTimerSeconds === 0 && !isTimerPaused) {
      const tObj = tasks.find(t => t.id === runningTaskId);
      if (tObj) {
        setAlarmTask(tObj);
        triggerAlarmChimeSound();
        logFocusSession(tObj.estimatedTime || 15);
      }
      setRunningTaskId(null);
    }
    return () => clearInterval(timer);
  }, [runningTaskId, isTimerPaused, activeTimerSeconds, tasks]);

  const triggerAlarmChimeSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      let count = 0;
      alarmAudioIntervalRef.current = setInterval(() => {
        if (count >= 5) {
          clearInterval(alarmAudioIntervalRef.current);
          return;
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
        count++;
      }, 500);
    } catch (e) {}
  };

  const stopAlarmSound = () => {
    if (alarmAudioIntervalRef.current) {
      clearInterval(alarmAudioIntervalRef.current);
    }
    setAlarmTask(null);
  };

  const startTaskTimer = (taskId) => {
    const target = tasks.find(t => t.id === taskId);
    if (!target) return;

    if (runningTaskId === taskId) {
      setIsTimerPaused(false);
    } else {
      setRunningTaskId(taskId);
      setActiveTimerSeconds((target.estimatedTime || 15) * 60);
      setIsTimerPaused(false);
    }
  };

  const pauseTaskTimer = () => {
    setIsTimerPaused(true);
  };

  const stopTaskTimer = () => {
    setRunningTaskId(null);
    setActiveTimerSeconds(0);
    setIsTimerPaused(false);
  };

  const addExtraMinutesToTaskTimer = (mins) => {
    setActiveTimerSeconds(prev => prev + mins * 60);
    if (alarmTask) {
      setRunningTaskId(alarmTask.id);
      stopAlarmSound();
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const checkAndRecordDailyStreak = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    setStreakData(prev => {
      if (prev.lastCompletedDate === todayStr) return prev;

      let newCount = 1;
      if (prev.lastCompletedDate === yesterdayStr) {
        newCount = prev.count + 1;
      } else {
        newCount = 1;
      }

      try {
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#6366f1', '#10b981', '#ec4899', '#06b6d4']
        });
      } catch (e) {}

      setCelebratedStreakNum(newCount);
      setShowStreakModal(true);

      return { count: newCount, lastCompletedDate: todayStr, celebratedToday: true };
    });
  };

  const addTask = (newTaskData) => {
    let link = newTaskData.linkUrl ? newTaskData.linkUrl.trim() : '';
    if (link && !/^https?:\/\//i.test(link)) {
      link = `https://${link}`;
    }

    const newTask = {
      id: `task-${Date.now()}`,
      title: newTaskData.title.trim(),
      description: newTaskData.description || '',
      category: newTaskData.category || 'personal',
      priority: newTaskData.priority || 'medium',
      dueDate: newTaskData.dueDate || new Date().toISOString().split('T')[0],
      linkUrl: link,
      completed: false,
      starred: !!newTaskData.starred,
      tags: newTaskData.tags || [],
      estimatedTime: parseInt(newTaskData.estimatedTime, 10) || 15,
      subtasks: newTaskData.subtasks || [],
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    setActiveModalTask(null);
  };

  const updateTask = (taskId, updatedFields) => {
    if (updatedFields.linkUrl) {
      let link = updatedFields.linkUrl.trim();
      if (link && !/^https?:\/\//i.test(link)) {
        link = `https://${link}`;
      }
      updatedFields.linkUrl = link;
    }
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, ...updatedFields } : t))
    );
    setActiveModalTask(null);
  };

  const deleteTask = (taskId) => {
    if (runningTaskId === taskId) stopTaskTimer();
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const toggleTaskComplete = (taskId) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const newCompletedState = !t.completed;
          if (newCompletedState) {
            checkAndRecordDailyStreak();
            if (runningTaskId === taskId) stopTaskTimer();
          }
          return {
            ...t,
            completed: newCompletedState,
            subtasks: t.subtasks.map(s => ({ ...s, completed: newCompletedState }))
          };
        }
        return t;
      })
    );
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map(s =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s
          );
          const allDone = updatedSubtasks.length > 0 && updatedSubtasks.every(s => s.completed);
          if (allDone) checkAndRecordDailyStreak();
          return { ...t, subtasks: updatedSubtasks, completed: allDone };
        }
        return t;
      })
    );
  };

  const toggleStar = (taskId) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, starred: !t.starred } : t))
    );
  };

  const duplicateTask = (taskId) => {
    const taskToDup = tasks.find(t => t.id === taskId);
    if (!taskToDup) return;
    const duplicated = {
      ...taskToDup,
      id: `task-${Date.now()}`,
      title: `${taskToDup.title} (Copy)`,
      completed: false,
      subtasks: taskToDup.subtasks.map(s => ({ ...s, id: `sub-${Date.now()}-${Math.random()}`, completed: false })),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [duplicated, ...prev]);
  };

  const toggleHabit = (habitId) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id === habitId) {
          const isNowDone = !h.completedToday;
          if (isNowDone) checkAndRecordDailyStreak();
          return {
            ...h,
            completedToday: isNowDone,
            streak: isNowDone ? h.streak + 1 : Math.max(0, h.streak - 1)
          };
        }
        return h;
      })
    );
  };

  const addHabit = (title) => {
    setHabits(prev => [...prev, { id: `h-${Date.now()}`, title: title.trim(), streak: 0, completedToday: false, history: [] }]);
  };

  const deleteHabit = (habitId) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
  };

  const loadTemplate = (templateType) => {
    let presetTasks = [];
    const todayStr = new Date().toISOString().split('T')[0];

    if (templateType === 'project') {
      presetTasks = [
        {
          title: '🚀 Define Project Scope',
          description: 'Outline milestones and user requirements.',
          category: 'code',
          priority: 'urgent',
          dueDate: todayStr,
          linkUrl: 'https://github.com',
          starred: true,
          tags: ['Project'],
          estimatedTime: 25,
          subtasks: [
            { id: 'p1', title: 'Write spec doc', completed: false },
            { id: 'p2', title: 'Design database schema', completed: false }
          ]
        }
      ];
    }

    presetTasks.forEach(pt => addTask(pt));
    setIsTemplatesOpen(false);
  };

  const logFocusSession = (minutes) => {
    setFocusStats(prev => ({
      ...prev,
      totalFocusMinutes: prev.totalFocusMinutes + minutes,
      completedSessions: prev.completedSessions + 1,
    }));
  };

  const exportData = () => {
    const data = { currentUserEmail, cloudSyncId, tasks, categories, habits, streakData, scratchpad, focusStats, theme, punishmentLog };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskpulse-${currentUserEmail || 'backup'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (importedJson) => {
    try {
      const data = JSON.parse(importedJson);
      if (data.currentUserEmail) loginWithEmail(data.currentUserEmail);
      if (data.cloudSyncId) connectCloudSyncId(data.cloudSyncId);
      if (data.tasks) setTasks(data.tasks);
      if (data.categories) setCategories(data.categories);
      if (data.habits) setHabits(data.habits);
      if (data.streakData) setStreakData(data.streakData);
      if (data.scratchpad) setScratchpad(data.scratchpad);
      if (data.focusStats) setFocusStats(data.focusStats);
      if (data.punishmentLog) setPunishmentLog(data.punishmentLog);
      alert('Data restored successfully!');
    } catch (e) {
      alert('Invalid backup JSON file.');
    }
  };

  return (
    <TaskContext.Provider
      value={{
        currentUserEmail,
        cloudSyncId,
        lastSyncedTime,
        connectCloudSyncId,
        pushToOnlineCloud,
        pullFromOnlineCloud,
        loginWithEmail,
        logoutUser,
        syncDataCloud,
        isSyncing,
        isAuthModalOpen,
        setIsAuthModalOpen,
        tasks,
        categories,
        habits,
        streakData,
        runningTaskId,
        activeTimerSeconds,
        isTimerPaused,
        alarmTask,
        activePunishment,
        punishmentTargetTask,
        punishmentLog,
        scratchpad,
        theme,
        activeView,
        searchQuery,
        sortBy,
        selectedTag,
        focusStats,
        isGuideOpen,
        activeModalTask,
        isFocusModalOpen,
        focusTask,
        isScratchpadOpen,
        isTemplatesOpen,
        isAmbientSoundOpen,
        showStreakModal,
        celebratedStreakNum,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        triggerPunishmentForMissedTask,
        acceptAndCompletePunishment,
        startTaskTimer,
        pauseTaskTimer,
        stopTaskTimer,
        stopAlarmSound,
        addExtraMinutesToTaskTimer,
        setShowStreakModal,
        setActiveView,
        setSearchQuery,
        setSortBy,
        setSelectedTag,
        setScratchpad,
        toggleTheme,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        toggleSubtask,
        toggleStar,
        duplicateTask,
        toggleHabit,
        addHabit,
        deleteHabit,
        loadTemplate,
        logFocusSession,
        exportData,
        importData,
        setIsGuideOpen,
        setActiveModalTask,
        setIsFocusModalOpen,
        setFocusTask,
        setIsScratchpadOpen,
        setIsTemplatesOpen,
        setIsAmbientSoundOpen
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => useContext(TaskContext);

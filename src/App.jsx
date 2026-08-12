import React, { useState, useEffect } from 'react';
import { TaskProvider, useTask } from './context/TaskContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TaskList } from './components/TaskList';
import { StatsDashboard } from './components/StatsDashboard';
import { HabitsTracker } from './components/HabitsTracker';
import { TaskModal } from './components/TaskModal';
import { FocusMode } from './components/FocusMode';
import { GuideMeSidebar } from './components/GuideMeSidebar';
import { AmbientSoundPlayer } from './components/AmbientSoundPlayer';
import { QuickTemplatesModal } from './components/QuickTemplatesModal';
import { ScratchpadModal } from './components/ScratchpadModal';
import { StreakCelebrationModal } from './components/StreakCelebrationModal';
import { TaskAlarmModal } from './components/TaskAlarmModal';
import { PunishmentModal } from './components/PunishmentModal';
import { OpeningSplash } from './components/OpeningSplash';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const { setActiveModalTask, setIsGuideOpen, setIsFocusModalOpen, setIsScratchpadOpen } = useTask();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setActiveModalTask('new');
      } else if (e.key === 'Escape') {
        setActiveModalTask(null);
        setIsGuideOpen(false);
        setIsFocusModalOpen(false);
        setIsScratchpadOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveModalTask, setIsGuideOpen, setIsFocusModalOpen, setIsScratchpadOpen]);

  return (
    <div className="app-container">
      {/* Website Opening Startup Splash Screen */}
      <OpeningSplash />

      {/* Ambient Mesh Glow Orbs */}
      <div className="app-bg-glow">
        <div className="glow-orb-1" />
        <div className="glow-orb-2" />
      </div>

      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="main-content staggered-entrance">
        <Header activeTab={activeTab} />

        {activeTab === 'tasks' && <TaskList />}
        {activeTab === 'habits' && <HabitsTracker />}
        {activeTab === 'stats' && <StatsDashboard />}
      </main>

      {/* Overlays & Modals */}
      <TaskModal />
      <FocusMode />
      <GuideMeSidebar />
      <AmbientSoundPlayer />
      <QuickTemplatesModal />
      <ScratchpadModal />
      <StreakCelebrationModal />
      <TaskAlarmModal />
      <PunishmentModal />
    </div>
  );
};

export default function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}

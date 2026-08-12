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
import { MobileBottomNav } from './components/MobileBottomNav';
import { UserAuthModal } from './components/UserAuthModal';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const {
    setActiveModalTask,
    setIsGuideOpen,
    setIsFocusModalOpen,
    setIsScratchpadOpen,
    isAuthModalOpen,
    setIsAuthModalOpen
  } = useTask();

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
        setIsAuthModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveModalTask, setIsGuideOpen, setIsFocusModalOpen, setIsScratchpadOpen, setIsAuthModalOpen]);

  return (
    <div className="app-container">
      {/* Website Opening Splash Screen */}
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

      {/* Relaxed Mobile Bottom Navigation & Floating Action Button */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

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
      <UserAuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
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

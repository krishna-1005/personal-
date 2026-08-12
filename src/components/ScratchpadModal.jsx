import React from 'react';
import { useTask } from '../context/TaskContext';
import { FileText, X, Save, Sparkles, Plus } from 'lucide-react';

export const ScratchpadModal = () => {
  const { isScratchpadOpen, setIsScratchpadOpen, scratchpad, setScratchpad, setActiveModalTask } = useTask();

  if (!isScratchpadOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsScratchpadOpen(false)}>
      <div className="modal-content scratchpad-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="scratchpad-header-title">
            <FileText size={20} color="#f59e0b" />
            <h2>Brain Dump & Scratchpad</h2>
          </div>
          <button className="btn-icon" onClick={() => setIsScratchpadOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <p className="scratchpad-subtext">
          Quick temporary notes, draft ideas, or copied links. Auto-saved instantly to your local storage!
        </p>

        <textarea
          className="form-textarea scratchpad-textarea"
          rows={12}
          placeholder="Type notes, draft ideas, or quick thoughts..."
          value={scratchpad}
          onChange={(e) => setScratchpad(e.target.value)}
          autoFocus
        />

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setActiveModalTask('new');
              setIsScratchpadOpen(false);
            }}
          >
            <Plus size={16} /> Convert Thought to Task
          </button>
          <button className="btn btn-primary" onClick={() => setIsScratchpadOpen(false)}>
            <Save size={16} /> Auto-Saved
          </button>
        </div>
      </div>
    </div>
  );
};

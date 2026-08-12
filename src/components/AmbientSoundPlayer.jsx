import React, { useState, useEffect, useRef } from 'react';
import { useTask } from '../context/TaskContext';
import { Volume2, VolumeX, Play, Pause, X, Headphones, CloudRain, Waves, Zap, Coffee } from 'lucide-react';

const SOUNDSCAPES = [
  { id: 'rain', name: 'Rainfall Focus', icon: CloudRain, color: '#06b6d4' },
  { id: 'waves', name: 'Ocean Waves', icon: Waves, color: '#6366f1' },
  { id: 'alpha', name: '10Hz Alpha Waves', icon: Zap, color: '#a855f7' },
  { id: 'coffee', name: 'Cafe Ambiance', icon: Coffee, color: '#f59e0b' }
];

export const AmbientSoundPlayer = () => {
  const { isAmbientSoundOpen, setIsAmbientSoundOpen } = useTask();

  const [activeSound, setActiveSound] = useState('rain');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);

  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const activeNodesRef = useRef([]);

  const stopAudio = () => {
    activeNodesRef.current.forEach(node => {
      try { node.stop(); node.disconnect(); } catch (e) {}
    });
    activeNodesRef.current = [];
  };

  const startAudio = (soundId) => {
    stopAudio();

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      gainNodeRef.current = ctx.createGain();
      gainNodeRef.current.gain.setValueAtTime(volume, ctx.currentTime);
      gainNodeRef.current.connect(ctx.destination);

      if (soundId === 'alpha') {
        // Binaural 10Hz Alpha Beats (200Hz left, 210Hz right)
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        const merger = ctx.createChannelMerger(2);

        oscL.frequency.setValueAtTime(200, ctx.currentTime);
        oscR.frequency.setValueAtTime(210, ctx.currentTime);

        oscL.connect(merger, 0, 0);
        oscR.connect(merger, 0, 1);
        merger.connect(gainNodeRef.current);

        oscL.start();
        oscR.start();
        activeNodesRef.current = [oscL, oscR];
      } else {
        // White / Pink Noise generator for Rain, Waves, and Cafe
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = soundId === 'rain' ? 'lowpass' : soundId === 'waves' ? 'bandpass' : 'highpass';
        filter.frequency.setValueAtTime(soundId === 'rain' ? 800 : 400, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gainNodeRef.current);

        whiteNoise.start();
        activeNodesRef.current = [whiteNoise];
      }
    } catch (e) {
      console.log('Audio Context Error:', e);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startAudio(activeSound);
    } else {
      stopAudio();
    }
    return () => stopAudio();
  }, [isPlaying, activeSound]);

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  if (!isAmbientSoundOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsAmbientSoundOpen(false)}>
      <div className="modal-content sound-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="sound-header-title">
            <Headphones size={20} color="#06b6d4" />
            <h2>Ambient Focus Soundscapes</h2>
          </div>
          <button className="btn-icon" onClick={() => setIsAmbientSoundOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Sound Selection Grid */}
        <div className="sound-grid">
          {SOUNDSCAPES.map(s => {
            const IconComp = s.icon;
            const isSelected = activeSound === s.id;

            return (
              <button
                key={s.id}
                className={`sound-card ${isSelected ? 'selected' : ''}`}
                style={{ '--sound-color': s.color }}
                onClick={() => {
                  setActiveSound(s.id);
                  setIsPlaying(true);
                }}
              >
                <IconComp size={24} color={s.color} />
                <span>{s.name}</span>
              </button>
            );
          })}
        </div>

        {/* Volume & Play Controls */}
        <div className="sound-controls-panel glass-panel">
          <button
            className="btn btn-primary sound-play-btn"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            <span>{isPlaying ? 'Pause Ambient Sound' : 'Play Ambient Sound'}</span>
          </button>

          <div className="volume-slider-row">
            <VolumeX size={16} color="#64748b" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="volume-slider"
            />
            <Volume2 size={16} color="#06b6d4" />
          </div>
        </div>
      </div>
    </div>
  );
};

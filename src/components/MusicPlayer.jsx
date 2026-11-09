import React, { useState, useEffect, useRef } from 'react';
import { asset } from '../utils/helpers';

export const MusicPlayer = ({ isPlaying, onToggle, volume = 0.65 }) => {
  const audioRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [internalMuted, setInternalMuted] = useState(false);
  const fadeIntervalRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0;
    audio.loop = true;

    const handleCanPlay = () => {
      setIsLoaded(true);
    };

    audio.addEventListener('canplaythrough', handleCanPlay);
    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, []);

  // Handle Play / Fade in
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    if (isPlaying && !internalMuted) {
      audio.play().then(() => {
        // Fade in to target volume over ~2 seconds
        let currentVol = audio.volume;
        const targetVol = volume;
        const step = targetVol / 20;

        fadeIntervalRef.current = setInterval(() => {
          currentVol = Math.min(targetVol, currentVol + step);
          audio.volume = currentVol;
          if (currentVol >= targetVol) {
            clearInterval(fadeIntervalRef.current);
          }
        }, 100);
      }).catch(err => {
        console.warn('Audio play request failed or was blocked by browser:', err);
      });
    } else {
      // Fade out
      let currentVol = audio.volume;
      const step = currentVol / 10;
      fadeIntervalRef.current = setInterval(() => {
        currentVol = Math.max(0, currentVol - step);
        audio.volume = currentVol;
        if (currentVol <= 0.05) {
          audio.pause();
          clearInterval(fadeIntervalRef.current);
        }
      }, 80);
    }
  }, [isPlaying, internalMuted, volume]);

  const toggleMute = () => {
    setInternalMuted(prev => !prev);
    if (onToggle) onToggle();
  };

  if (!isPlaying && audioRef.current?.paused) {
    // Hidden until started
    return (
      <audio
        ref={audioRef}
        src={asset('audio/coquette-birthday-theme.mp3')}
        preload="auto"
      />
    );
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={asset('audio/coquette-birthday-theme.mp3')}
        preload="auto"
      />
      <button
        onClick={toggleMute}
        className="coquette-music-btn"
        title={internalMuted ? 'Turn on background music' : 'Mute music'}
        aria-label="Toggle music"
      >
        <span className={`music-disc ${isPlaying && !internalMuted ? 'playing' : ''}`}>
          {internalMuted ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          )}
        </span>
        <span className="music-pulse-ring" />
      </button>

      <style>{`
        .coquette-music-btn {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 100;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid #FFFFFF;
          background: #FCE3EA;
          color: #9B526C;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(155, 82, 108, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .coquette-music-btn:hover {
          transform: scale(1.1);
          background: #F6C4D2;
        }

        .music-disc.playing {
          animation: spin 4s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .music-pulse-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1.5px solid #F2A9BF;
          opacity: 0.6;
          animation: ringPulse 2.5s ease-out infinite;
          pointer-events: none;
        }

        @keyframes ringPulse {
          0% { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(1.35); opacity: 0; }
        }
      `}</style>
    </>
  );
};


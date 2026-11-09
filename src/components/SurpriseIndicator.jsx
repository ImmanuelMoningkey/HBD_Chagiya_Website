import React from 'react';
import { CuteHeart, Sparkle } from './DecorativeElements';

export const SurpriseIndicator = ({ visible, onClick }) => {
  if (!visible) return null;

  return (
    <div className="surprise-indicator-wrapper" onClick={onClick}>
      <div className="indicator-pill">
        <div className="exclamation-badge anim-bounce">!</div>
        <div className="indicator-text-group">
          <span className="indicator-msg">Wait... there's one more thing! ♡</span>
          <span className="indicator-sub">Scroll down below to see</span>
        </div>
        <div className="indicator-arrow">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
        </div>
      </div>

      <style>{`
        .surprise-indicator-wrapper {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 60;
          cursor: pointer;
          animation: popUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          width: 90%;
          max-width: 380px;
        }

        @keyframes popUp {
          from {
            opacity: 0;
            transform: translate(-50%, 40px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }

        .indicator-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 2px solid var(--color-dusty-pink);
          border-radius: 999px;
          padding: 10px 18px 10px 12px;
          box-shadow: 0 10px 30px rgba(155, 82, 108, 0.25), 0 0 15px rgba(242, 169, 191, 0.4);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .indicator-pill:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 14px 36px rgba(155, 82, 108, 0.35);
        }

        .exclamation-badge {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #F2A9BF, #E995B0);
          color: #FFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-serif);
          font-size: 1.4rem;
          font-weight: 700;
          box-shadow: 0 3px 8px rgba(155, 82, 108, 0.25);
          flex-shrink: 0;
        }

        .indicator-text-group {
          display: flex;
          flex-direction: column;
          text-align: left;
          flex-grow: 1;
        }

        .indicator-msg {
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--color-deep-rose);
        }

        .indicator-sub {
          font-size: 0.78rem;
          color: var(--color-dark-mauve);
          opacity: 0.8;
        }

        .indicator-arrow {
          color: var(--color-dusty-pink);
          animation: floatGentle 1.8s infinite ease-in-out;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};


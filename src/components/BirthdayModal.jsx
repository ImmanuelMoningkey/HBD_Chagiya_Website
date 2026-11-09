import React from 'react';
import { CoquetteBow, Sparkle, CuteHeart } from './DecorativeElements';

export const BirthdayModal = ({ giftData, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="birthday-modal-backdrop" onClick={onClose}>
      {/* Sparkles and falling confetti */}
      <div className="confetti-container">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="confetti-item"
            style={{
              left: `${(i * 8.5) + 3}%`,
              animationDelay: `${(i % 5) * 0.4}s`,
              animationDuration: `${3.5 + (i % 3)}s`,
            }}
          >
            {i % 2 === 0 ? (
              <CuteHeart size={16 + (i % 8)} color={i % 4 === 0 ? '#E995B0' : '#F6C4D2'} />
            ) : (
              <Sparkle size={14 + (i % 6)} color={i % 3 === 0 ? '#FFE8A3' : '#F2A9BF'} />
            )}
          </div>
        ))}
      </div>

      <div
        className="birthday-modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Bow */}
        <div className="modal-top-bow">
          <CoquetteBow size={64} color="#E995B0" />
        </div>

        {/* Scrollable interior */}
        <div className="modal-inner-scroll">
          {/* Main Polaroid Photo (Photo 13) */}
          <div className="modal-polaroid-frame polaroid-card">
            <div className="polaroid-tape washi-tape" />
            <div className="modal-photo-wrapper">
              <img
                src={giftData.photo}
                alt="Birthday Chagiya"
                className="modal-main-img"
              />
            </div>
            <div className="polaroid-caption">
              <span>My forever favorite person ♡</span>
            </div>
          </div>

          {/* Birthday Message Heading */}
          <div className="modal-text-content">
            <h1 className="modal-title font-serif">{giftData.title}</h1>
            
            <div className="modal-paragraphs">
              {giftData.bodyParagraphs.map((paragraph, idx) => (
                <p key={idx} className="modal-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Close button */}
          <div className="modal-actions">
            <button className="coquette-btn modal-close-btn" onClick={onClose}>
              <span>Close</span>
              <span style={{ fontSize: '1.2rem', marginLeft: '2px' }}>♡</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .birthday-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(112, 66, 82, 0.45);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 16px;
          animation: modalFadeIn 0.4s ease-out;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .confetti-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .confetti-item {
          position: absolute;
          top: -30px;
          animation: fall linear infinite;
        }

        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0.2;
          }
        }

        .birthday-modal-content {
          position: relative;
          background: radial-gradient(circle at center top, #FFFFFF 0%, #FFF5F7 80%, #FDE9EE 100%);
          border: 2px solid #F6C4D2;
          border-radius: 28px;
          max-width: 480px;
          width: 100%;
          max-height: 88vh;
          box-shadow: 0 20px 50px rgba(155, 82, 108, 0.35);
          display: flex;
          flex-direction: column;
          animation: modalZoomIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          overflow: visible;
        }

        @keyframes modalZoomIn {
          from {
            opacity: 0;
            transform: scale(0.85) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .modal-top-bow {
          position: absolute;
          top: -32px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
        }

        .modal-inner-scroll {
          overflow-y: auto;
          padding: 44px 20px 28px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          -webkit-overflow-scrolling: touch;
        }

        .modal-polaroid-frame {
          width: 100%;
          max-width: 320px;
          margin-bottom: 24px;
        }

        .modal-photo-wrapper {
          width: 100%;
          height: 300px;
          border-radius: 4px;
          overflow: hidden;
          background: #FCE8EE;
        }

        .modal-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-text-content {
          margin-bottom: 24px;
          max-width: 400px;
        }

        .modal-title {
          font-size: 2.1rem;
          color: var(--color-deep-rose);
          margin-bottom: 16px;
          line-height: 1.25;
        }

        .modal-paragraphs {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .modal-paragraph {
          font-size: 0.98rem;
          line-height: 1.6;
          color: var(--color-dark-mauve);
        }

        .modal-actions {
          margin-top: 8px;
        }

        .modal-close-btn {
          padding: 12px 32px;
          font-size: 1rem;
        }

        @media (min-width: 640px) {
          .modal-title {
            font-size: 2.4rem;
          }
          .modal-photo-wrapper {
            height: 340px;
          }
        }
      `}</style>
    </div>
  );
};


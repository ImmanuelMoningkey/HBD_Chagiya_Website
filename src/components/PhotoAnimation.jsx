import React, { useEffect, useState } from 'react';
import { CoquetteBow, Sparkle } from './DecorativeElements';

export const PhotoAnimation = ({ photos, onComplete }) => {
  const [stage, setStage] = useState(0); // 0: start, 1: showing photos, 2: floating upwards

  useEffect(() => {
    // Sequence timing
    const t1 = setTimeout(() => setStage(1), 300); // fade in
    const t2 = setTimeout(() => setStage(2), 3200); // start lifting up towards top of viewport
    const t3 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 5500); // finish sequence

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className={`photo-anim-overlay ${stage === 2 ? 'exiting' : ''}`}>
      <div className="sparkle-layer">
        <Sparkle size={32} color="#F2A9BF" style={{ position: 'absolute', top: '15%', left: '10%' }} />
        <Sparkle size={24} color="#E995B0" style={{ position: 'absolute', top: '40%', right: '12%' }} />
        <Sparkle size={28} color="#F6C4D2" style={{ position: 'absolute', bottom: '20%', left: '20%' }} />
      </div>

      <div className="photos-stack">
        {photos.map((item, index) => {
          const delays = [0, 0.4, 0.8];
          const delay = delays[index] || 0;

          return (
            <div
              key={item.id}
              className={`anim-polaroid item-${index} ${stage >= 1 ? 'visible' : ''} ${stage === 2 ? 'fly-up' : ''}`}
              style={{
                '--rotation': `${item.rotation}deg`,
                '--delay': `${delay}s`,
                '--fly-delay': `${index * 0.15}s`,
              }}
            >
              <div className="polaroid-card">
                <div className="polaroid-tape" />
                <div className="polaroid-bow-corner">
                  <CoquetteBow size={28} color="#F2A9BF" />
                </div>
                <div className="polaroid-img-wrapper">
                  <img src={item.src} alt={item.caption} loading="eager" />
                </div>
                <div className="polaroid-caption">{item.caption}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="anim-footer-note">
        <span>✨ Whispers of beautiful memories...</span>
      </div>

      <style>{`
        .photo-anim-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: rgba(255, 248, 245, 0.94);
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: opacity 0.8s ease;
        }

        .photo-anim-overlay.exiting {
          pointer-events: none;
        }

        .sparkle-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .photos-stack {
          position: relative;
          width: 90vw;
          max-width: 420px;
          height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .anim-polaroid {
          position: absolute;
          width: 240px;
          opacity: 0;
          transform: translateY(40px) scale(0.9) rotate(0deg);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .anim-polaroid.visible {
          opacity: 1;
          transform: translateY(0) scale(1) rotate(var(--rotation));
          transition-delay: var(--delay);
        }

        /* Responsive offsets so cards fan out like a memory scrapbook */
        .anim-polaroid.item-0 {
          z-index: 1;
          left: 5%;
          top: 10px;
        }
        .anim-polaroid.item-1 {
          z-index: 2;
          right: 8%;
          bottom: 15px;
        }
        .anim-polaroid.item-2 {
          z-index: 3;
          left: 20%;
          top: 45px;
        }

        .anim-polaroid.fly-up {
          animation: flyAwayUp 2.2s cubic-bezier(0.45, 0, 0.2, 1) forwards;
          animation-delay: var(--fly-delay);
        }

        @keyframes flyAwayUp {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(var(--rotation));
          }
          30% {
            transform: translateY(-40px) scale(1.02) rotate(calc(var(--rotation) + 2deg));
          }
          100% {
            opacity: 0;
            transform: translateY(-130vh) scale(0.85) rotate(calc(var(--rotation) - 8deg));
          }
        }

        .polaroid-bow-corner {
          position: absolute;
          top: -10px;
          right: -10px;
          z-index: 4;
        }

        .polaroid-img-wrapper {
          width: 100%;
          height: 220px;
          overflow: hidden;
          border-radius: 4px;
        }

        .polaroid-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .anim-footer-note {
          position: absolute;
          bottom: 40px;
          font-family: var(--font-serif);
          font-size: 1.15rem;
          color: var(--color-deep-rose);
          letter-spacing: 0.05em;
          animation: floatGentle 3s ease-in-out infinite;
        }

        @media (min-width: 640px) {
          .photos-stack {
            max-width: 580px;
            height: 440px;
          }
          .anim-polaroid {
            width: 270px;
          }
          .polaroid-img-wrapper {
            height: 250px;
          }
          .anim-polaroid.item-0 {
            left: 10%;
          }
          .anim-polaroid.item-1 {
            right: 12%;
          }
          .anim-polaroid.item-2 {
            left: 28%;
          }
        }
      `}</style>
    </div>
  );
};


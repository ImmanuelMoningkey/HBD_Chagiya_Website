import React from 'react';
import { CoquetteBow, Sparkle, ScallopCoaster } from './DecorativeElements';

export const MysteryObject = ({ object, isOpened, onClick }) => {
  return (
    <div
      className={`mystery-object-card ${isOpened ? 'opened' : ''} type-${object.id}`}
      onClick={() => onClick(object.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick(object.id);
      }}
    >
      {/* Status Badge */}
      {isOpened && (
        <div className="opened-check-badge">
          <span>Diselidiki ♡</span>
        </div>
      )}

      {/* Decorative Coaster Base */}
      <div className="object-coaster">
        <ScallopCoaster size={160} color="#FFF5F7" stroke="#F2A9BF" />
      </div>

      {/* 3D Render Image Container */}
      <div className="object-image-wrapper">
        <img
          src={object.icon}
          alt={object.title}
          className={`object-3d-image anim-${object.id}`}
          loading="eager"
        />
        {/* Subtle sparkle overlay */}
        <div className="object-sparkle">
          <Sparkle size={18} color="#F2A9BF" />
        </div>
      </div>

      {/* Object Label */}
      <div className="object-label-container">
        <span className="object-label-text">{object.shortLabel}</span>
        <div className="object-label-bow">
          <CoquetteBow size={18} color="#E995B0" />
        </div>
      </div>

      <style>{`
        .mystery-object-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          user-select: none;
          padding: 16px 8px 24px 8px;
          border-radius: 24px;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease;
          width: 100%;
          max-width: 220px;
        }

        .mystery-object-card:hover {
          transform: translateY(-8px);
        }

        .mystery-object-card:active {
          transform: scale(0.95);
        }

        .opened-check-badge {
          position: absolute;
          top: 0px;
          z-index: 5;
          background: #FFF;
          border: 1px solid #F2A9BF;
          border-radius: 20px;
          padding: 4px 12px;
          box-shadow: 0 4px 10px rgba(155, 82, 108, 0.12);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-deep-rose);
          letter-spacing: 0.02em;
        }

        .object-coaster {
          position: absolute;
          top: 35px;
          z-index: 1;
          opacity: 0.85;
          pointer-events: none;
          transform: scale(0.95);
          transition: transform 0.3s ease;
        }

        .mystery-object-card:hover .object-coaster {
          transform: scale(1.05);
        }

        .object-image-wrapper {
          position: relative;
          width: 140px;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          margin-bottom: 8px;
        }

        .object-3d-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 10px 14px rgba(155, 82, 108, 0.15));
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease;
        }

        /* Object-specific animations */
        /* Matcha McFlurry: gentle float + subtle rotation on hover */
        .anim-matcha {
          animation: floatSlow 3.8s ease-in-out infinite;
        }
        .type-matcha:hover .anim-matcha {
          transform: rotate(4deg) scale(1.08);
        }
        .type-matcha:active .anim-matcha {
          transform: scale(0.9) translateY(4px);
        }

        /* Black Sunglasses: float + shine tilt */
        .anim-shades {
          animation: floatSlow 4.2s ease-in-out infinite 0.5s;
        }
        .type-shades:hover .anim-shades {
          transform: rotate(-3deg) scale(1.08);
          filter: drop-shadow(0 12px 18px rgba(85, 66, 77, 0.25));
        }
        .type-shades:active .anim-shades {
          transform: scale(0.92);
        }

        /* Pink Wristwatch: float + subtle bounce pulse */
        .anim-time {
          animation: floatSlow 4s ease-in-out infinite 1s;
        }
        .type-time:hover .anim-time {
          transform: rotate(3deg) scale(1.08);
        }
        .type-time:active .anim-time {
          transform: scale(0.92);
        }

        .object-sparkle {
          position: absolute;
          top: 10px;
          right: 5px;
          opacity: 0.85;
          animation: pulseGlow 2.5s infinite ease-in-out;
        }

        .object-label-container {
          position: relative;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #F6C4D2;
          padding: 6px 18px;
          border-radius: 999px;
          box-shadow: 0 4px 12px rgba(155, 82, 108, 0.08);
          margin-top: 4px;
        }

        .object-label-text {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-deep-rose);
          letter-spacing: 0.03em;
        }

        .object-label-bow {
          display: flex;
          align-items: center;
        }

        @media (min-width: 640px) {
          .object-image-wrapper {
            width: 165px;
            height: 165px;
          }
          .object-label-text {
            font-size: 1.35rem;
          }
        }
      `}</style>
    </div>
  );
};

export const MysterySection = ({ objects, openedObjects, onSelectObject }) => {
  return (
    <section className="mystery-section" id="mystery-section">
      <div className="mystery-header">
        <h2 className="mystery-title">Ada yang spesial hari ini, tapi apa ya...</h2>
        <p className="mystery-subtitle">Coba selidiki di ketiga barang ini deh ♡</p>
      </div>

      <div className="mystery-objects-grid">
        {objects.map((obj) => (
          <MysteryObject
            key={obj.id}
            object={obj}
            isOpened={!!openedObjects[obj.id]}
            onClick={onSelectObject}
          />
        ))}
      </div>

      <style>{`
        .mystery-section {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          padding: 30px 16px 20px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .mystery-header {
          margin-bottom: 28px;
        }

        .mystery-title {
          font-size: 1.85rem;
          color: var(--color-deep-rose);
          line-height: 1.3;
          margin-bottom: 8px;
        }

        .mystery-subtitle {
          font-size: 1.1rem;
          color: var(--color-dark-mauve);
          opacity: 0.9;
        }

        .mystery-objects-grid {
          width: 100%;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 24px;
        }

        @media (max-width: 480px) {
          .mystery-objects-grid {
            gap: 16px;
          }
          .mystery-title {
            font-size: 1.6rem;
          }
          .mystery-subtitle {
            font-size: 0.98rem;
          }
        }

        @media (min-width: 768px) {
          .mystery-title {
            font-size: 2.3rem;
          }
          .mystery-objects-grid {
            gap: 36px;
          }
        }
      `}</style>
    </section>
  );
};


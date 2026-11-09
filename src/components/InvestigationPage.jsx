import React, { useRef, useState } from 'react';
import { CoquetteBow, Sparkle, CuteHeart } from './DecorativeElements';

export const InvestigationPage = ({ object, onBack }) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const videoRef = useRef(null);
  const currentMedia = object.media[activeMediaIndex] || object.media[0];

  return (
    <div className="investigation-page-overlay">
      {/* Decorative background elements */}
      <div className="inv-decorations">
        <Sparkle size={26} color="#F2A9BF" style={{ position: 'absolute', top: '10%', left: '8%' }} />
        <CuteHeart size={20} color="#E995B0" style={{ position: 'absolute', top: '18%', right: '10%' }} />
        <CuteHeart size={16} color="#F6C4D2" style={{ position: 'absolute', bottom: '15%', left: '12%' }} />
      </div>

      <div className="investigation-container">
        {/* Top Header */}
        <div className="inv-header">
          <div className="inv-object-pill">
            <CoquetteBow size={24} color="#E995B0" />
            <span className="inv-object-title">{object.title}</span>
          </div>
          <p className="inv-tagline font-script">{object.tagline}</p>
        </div>

        {/* Media Frame (Polaroid / Scrapbook style) */}
        <div className="inv-media-card polaroid-card">
          <div className="polaroid-tape washi-tape" />
          
          <div className="inv-media-frame">
            {currentMedia.type === 'video' ? (
              <div className="video-player-wrapper">
                <video
                  ref={videoRef}
                  src={currentMedia.src}
                  poster={currentMedia.poster}
                  controls
                  playsInline
                  preload="metadata"
                  className="inv-video-element"
                />
              </div>
            ) : (
              <div className="img-player-wrapper">
                <img
                  src={currentMedia.src}
                  alt={currentMedia.caption}
                  className="inv-image-element"
                  loading="lazy"
                />
              </div>
            )}
          </div>

          <div className="inv-polaroid-caption">
            <span>{currentMedia.caption}</span>
          </div>

          <div className="inv-card-bow-decor">
            <CoquetteBow size={32} color="#F2A9BF" />
          </div>
        </div>

        {/* Gallery thumbnails if multiple media */}
        {object.media.length > 1 && (
          <div className="inv-thumbnails-row">
            {object.media.map((item, idx) => (
              <button
                key={idx}
                className={`inv-thumb-btn ${activeMediaIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveMediaIndex(idx)}
              >
                <img
                  src={item.type === 'video' ? item.poster : item.src}
                  alt={`thumbnail-${idx}`}
                />
                {item.type === 'video' && <span className="video-badge">▶</span>}
              </button>
            ))}
          </div>
        )}

        {/* Personal Note Box */}
        <div className="inv-note-box">
          <div className="inv-note-pin">♡</div>
          <p className="inv-note-quote font-serif">"{object.note}"</p>
          <p className="inv-note-desc">{object.description}</p>
        </div>

        {/* Navigation Return Button */}
        <div className="inv-actions">
          <button className="coquette-btn inv-back-btn" onClick={onBack}>
            <span>Selidiki yang lain</span>
            <span style={{ fontSize: '1.2rem', marginLeft: '2px' }}>♡</span>
          </button>
        </div>
      </div>

      <style>{`
        .investigation-page-overlay {
          min-height: 100vh;
          width: 100%;
          background: radial-gradient(circle at center, #FFFFFF 0%, #FFF5F7 70%, #FCEAF0 100%);
          padding: 30px 16px 50px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 40;
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .inv-decorations {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .investigation-container {
          max-width: 520px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .inv-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .inv-object-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #FFFFFF;
          border: 1.5px solid #F2A9BF;
          border-radius: 999px;
          padding: 6px 20px;
          box-shadow: 0 4px 14px rgba(155, 82, 108, 0.08);
          margin-bottom: 6px;
        }

        .inv-object-title {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--color-deep-rose);
        }

        .inv-tagline {
          font-size: 1.6rem;
          color: var(--color-dusty-pink);
        }

        .inv-media-card {
          width: 100%;
          max-width: 440px;
          margin-bottom: 20px;
          position: relative;
        }

        .inv-card-bow-decor {
          position: absolute;
          top: -14px;
          right: -10px;
          z-index: 4;
        }

        .inv-media-frame {
          width: 100%;
          border-radius: 4px;
          overflow: hidden;
          background: #FCE8EE;
          min-height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-player-wrapper, .img-player-wrapper {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .inv-video-element {
          width: 100%;
          max-height: 440px;
          border-radius: 4px;
          object-fit: contain;
          background: #000;
        }

        .inv-image-element {
          width: 100%;
          max-height: 440px;
          border-radius: 4px;
          object-fit: cover;
        }

        .inv-polaroid-caption {
          margin-top: 14px;
          text-align: center;
          font-family: var(--font-script);
          font-size: 1.45rem;
          color: var(--color-deep-rose);
          line-height: 1.25;
        }

        .inv-thumbnails-row {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          overflow-x: auto;
          padding: 4px 8px;
          max-width: 100%;
        }

        .inv-thumb-btn {
          position: relative;
          width: 60px;
          height: 60px;
          border-radius: 8px;
          border: 2px solid transparent;
          overflow: hidden;
          padding: 0;
          cursor: pointer;
          background: #FFF;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .inv-thumb-btn.active {
          border-color: var(--color-dusty-pink);
          transform: scale(1.08);
          box-shadow: 0 4px 12px rgba(233, 149, 176, 0.5);
        }

        .inv-thumb-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-badge {
          position: absolute;
          bottom: 2px;
          right: 2px;
          background: rgba(0,0,0,0.6);
          color: #fff;
          font-size: 0.65rem;
          padding: 1px 4px;
          border-radius: 4px;
        }

        .inv-note-box {
          width: 100%;
          background: rgba(255, 255, 255, 0.85);
          border: 1.5px dashed #F2A9BF;
          border-radius: 16px;
          padding: 24px 20px 20px 20px;
          position: relative;
          text-align: center;
          margin-bottom: 30px;
          box-shadow: 0 8px 24px rgba(155, 82, 108, 0.06);
        }

        .inv-note-pin {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 26px;
          height: 26px;
          background: #F6C4D2;
          color: #9B526C;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }

        .inv-note-quote {
          font-size: 1.35rem;
          color: var(--color-deep-rose);
          margin-bottom: 8px;
          line-height: 1.35;
        }

        .inv-note-desc {
          font-size: 0.95rem;
          color: var(--color-dark-mauve);
          opacity: 0.85;
          line-height: 1.5;
        }

        .inv-actions {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .inv-back-btn {
          padding: 14px 34px;
          font-size: 1.05rem;
        }
      `}</style>
    </div>
  );
};


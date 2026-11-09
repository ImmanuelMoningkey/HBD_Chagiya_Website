import React from 'react';
import { CoquetteBow, Sparkle, CuteHeart } from './DecorativeElements';

export const IntroScreen = ({ onOpen }) => {
  return (
    <div className="intro-container">
      {/* Soft floating background hearts & sparkles */}
      <div className="floating-decorations">
        <CuteHeart size={22} color="#F2A9BF" style={{ position: 'absolute', top: '15%', left: '12%', animation: 'floatSlow 4s infinite ease-in-out' }} />
        <CuteHeart size={16} color="#E995B0" style={{ position: 'absolute', top: '65%', left: '10%', animation: 'floatSlow 5s infinite 1s ease-in-out' }} />
        <CuteHeart size={26} color="#F6C4D2" style={{ position: 'absolute', top: '22%', right: '14%', animation: 'floatSlow 4.5s infinite 0.5s ease-in-out' }} />
        <CuteHeart size={18} color="#F2A9BF" style={{ position: 'absolute', top: '75%', right: '12%', animation: 'floatSlow 5.5s infinite 1.5s ease-in-out' }} />
        
        <Sparkle size={24} color="#F2A9BF" style={{ position: 'absolute', top: '28%', left: '25%', animation: 'pulseGlow 3s infinite ease-in-out' }} />
        <Sparkle size={20} color="#E995B0" style={{ position: 'absolute', top: '35%', right: '22%', animation: 'pulseGlow 3.5s infinite 1s ease-in-out' }} />
        <Sparkle size={28} color="#F6C4D2" style={{ position: 'absolute', top: '70%', left: '30%', animation: 'pulseGlow 4s infinite 0.5s ease-in-out' }} />
      </div>

      <div className="intro-card">
        {/* Envelope / Little Gift Package Aesthetic */}
        <div className="envelope-box">
          <div className="envelope-flap" />
          <div className="envelope-body">
            <div className="envelope-seal">
              <CoquetteBow size={56} color="#E995B0" />
            </div>
          </div>
          <div className="envelope-shadow" />
        </div>

        <div className="intro-text-wrapper">
          <span className="font-script intro-subtitle">Special celebration</span>
          <h1 className="intro-title">There's a little surprise for you...</h1>
          <p className="intro-hint">A tiny journey crafted with sweet memories and love ♡</p>
        </div>

        <button className="coquette-btn intro-btn anim-bounce" onClick={onOpen}>
          <span>Buka Kejutan</span>
          <span style={{ fontSize: '1.2rem', marginLeft: '2px' }}>♡</span>
        </button>
      </div>

      <style>{`
        .intro-container {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          position: relative;
          background: radial-gradient(circle at center, #FFFFFF 0%, #FFF5F7 60%, #FCE8EE 100%);
          z-index: 10;
        }

        .floating-decorations {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .intro-card {
          max-width: 440px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 32px 24px;
          position: relative;
          z-index: 2;
        }

        /* 3D Coquette Envelope Illustration */
        .envelope-box {
          position: relative;
          width: 180px;
          height: 130px;
          margin-bottom: 28px;
          perspective: 600px;
        }

        .envelope-body {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #FFF9FA 0%, #FDE9EE 100%);
          border: 2px solid #F6C4D2;
          border-radius: 12px;
          box-shadow: 0 12px 30px rgba(155, 82, 108, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .envelope-flap {
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          border-left: 90px solid transparent;
          border-right: 90px solid transparent;
          border-top: 65px solid #F8D5DF;
          z-index: 2;
          filter: drop-shadow(0 2px 4px rgba(155, 82, 108, 0.1));
        }

        .envelope-seal {
          position: absolute;
          top: 42px;
          z-index: 3;
          animation: floatGentle 3s ease-in-out infinite;
        }

        .envelope-shadow {
          position: absolute;
          bottom: -15px;
          left: 15px;
          right: 15px;
          height: 20px;
          background: radial-gradient(ellipse at center, rgba(155, 82, 108, 0.2) 0%, transparent 70%);
          border-radius: 50%;
        }

        .intro-text-wrapper {
          margin-bottom: 32px;
        }

        .intro-subtitle {
          font-size: 2rem;
          color: var(--color-dusty-pink);
          display: block;
          margin-bottom: -4px;
        }

        .intro-title {
          font-size: 1.55rem;
          line-height: 1.3;
          margin-bottom: 12px;
          color: var(--color-deep-rose);
          max-width: 290px;
          margin-left: auto;
          margin-right: auto;
          white-space: normal;
        }

        .intro-hint {
          font-size: 0.95rem;
          color: var(--color-dark-mauve);
          opacity: 0.85;
          max-width: 300px;
          margin: 0 auto;
        }

        .intro-btn {
          font-size: 1.15rem;
          padding: 16px 38px;
        }

        @media (min-width: 640px) {
          .intro-title {
            font-size: 2.35rem;
          }
          .envelope-box {
            width: 210px;
            height: 150px;
          }
          .envelope-flap {
            border-left-width: 105px;
            border-right-width: 105px;
            border-top-width: 75px;
          }
          .envelope-seal {
            top: 52px;
          }
        }
      `}</style>
    </div>
  );
};

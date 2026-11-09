import React, { useState } from 'react';
import { CoquetteBow, Sparkle, CuteHeart } from './DecorativeElements';

export const GiftSection = ({ onOpenGift, sectionRef }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(() => {
      onOpenGift();
      setIsOpening(false);
    }, 1200);
  };

  return (
    <section className="final-gift-section" ref={sectionRef} id="final-gift-section">
      <div className="gift-header">
        <span className="font-script gift-sub-script">A special surprise waiting for you</span>
        <h2 className="gift-heading">Looks like there's one more thing for you...</h2>
        <p className="gift-instruction">Tap to open your gift ♡</p>
      </div>

      <div
        className={`coquette-gift-box ${isHovered ? 'hovered' : ''} ${isOpening ? 'opening' : ''}`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        tabIndex={0}
      >
        {/* Floating hearts/sparkles around gift */}
        <div className="gift-sparkles-orbit">
          <Sparkle size={24} color="#F2A9BF" style={{ position: 'absolute', top: '-20px', left: '-15px' }} />
          <Sparkle size={20} color="#E995B0" style={{ position: 'absolute', bottom: '10px', right: '-20px' }} />
          <CuteHeart size={20} color="#F6C4D2" style={{ position: 'absolute', top: '20px', right: '-15px' }} />
        </div>

        {/* 3D Styled SVG & CSS Gift Box */}
        <div className="gift-3d-model">
          {/* Box Lid */}
          <div className="gift-lid">
            <div className="gift-lid-bow">
              <CoquetteBow size={84} color="#E995B0" />
            </div>
            <div className="gift-lid-lip" />
          </div>

          {/* Box Body */}
          <div className="gift-body">
            {/* Satin Ribbons */}
            <div className="gift-ribbon-vertical" />
            <div className="gift-ribbon-horizontal" />
            {/* Pearl & Lace accents */}
            <div className="gift-lace-pattern" />
          </div>

          {/* Shadow underneath */}
          <div className="gift-ground-shadow" />
        </div>

        {/* Burst particles on open */}
        {isOpening && (
          <div className="gift-burst-effect">
            <CuteHeart size={28} color="#E995B0" style={{ position: 'absolute', top: '-40px', left: '20%' }} />
            <CuteHeart size={24} color="#F2A9BF" style={{ position: 'absolute', top: '-50px', right: '25%' }} />
            <Sparkle size={32} color="#FFF" style={{ position: 'absolute', top: '-60px', left: '45%' }} />
          </div>
        )}
      </div>

      <style>{`
        .final-gift-section {
          width: 100%;
          padding: 60px 16px 100px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 10;
        }

        .gift-header {
          margin-bottom: 36px;
          max-width: 500px;
        }

        .gift-sub-script {
          font-size: 2.1rem;
          color: var(--color-dusty-pink);
          display: block;
          margin-bottom: -6px;
        }

        .gift-heading {
          font-size: 2rem;
          line-height: 1.25;
          color: var(--color-deep-rose);
          margin-bottom: 8px;
        }

        .gift-instruction {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--color-dusty-pink);
          letter-spacing: 0.02em;
          animation: pulseGlow 3s infinite ease-in-out;
        }

        /* 3D Gift Box */
        .coquette-gift-box {
          position: relative;
          width: 220px;
          height: 220px;
          cursor: pointer;
          user-select: none;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .coquette-gift-box:hover {
          transform: translateY(-8px) scale(1.04);
        }

        .coquette-gift-box:active {
          transform: scale(0.97);
        }

        .gift-3d-model {
          position: relative;
          width: 100%;
          height: 100%;
          perspective: 600px;
        }

        /* Lid styling */
        .gift-lid {
          position: absolute;
          top: 30px;
          left: 10px;
          right: 10px;
          height: 48px;
          background: linear-gradient(135deg, #FFF0F4 0%, #FAD7E2 100%);
          border: 2px solid #F6C4D2;
          border-radius: 14px;
          box-shadow: 0 6px 16px rgba(155, 82, 108, 0.15);
          z-index: 4;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease;
        }

        .gift-lid-bow {
          position: absolute;
          top: -46px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 5;
          animation: floatSlow 4s infinite ease-in-out;
        }

        .gift-lid-lip {
          position: absolute;
          bottom: -4px;
          left: -2px;
          right: -2px;
          height: 8px;
          background: #EFA8BE;
          border-radius: 0 0 8px 8px;
        }

        /* Body styling */
        .gift-body {
          position: absolute;
          top: 68px;
          left: 20px;
          right: 20px;
          bottom: 15px;
          background: linear-gradient(135deg, #FDF2F5 0%, #F9CED9 100%);
          border: 2px solid #F6C4D2;
          border-radius: 12px;
          box-shadow: 0 16px 36px rgba(155, 82, 108, 0.18);
          overflow: hidden;
          z-index: 2;
        }

        .gift-ribbon-vertical {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 32px;
          background: linear-gradient(90deg, #F6C4D2, #E995B0 50%, #D87895 100%);
          box-shadow: inset 0 0 4px rgba(255,255,255,0.6);
        }

        .gift-ribbon-horizontal {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 28px;
          background: linear-gradient(180deg, #F6C4D2, #E995B0 50%, #D87895 100%);
          box-shadow: inset 0 0 4px rgba(255,255,255,0.6);
        }

        .gift-ground-shadow {
          position: absolute;
          bottom: -5px;
          left: 15px;
          right: 15px;
          height: 25px;
          background: radial-gradient(ellipse at center, rgba(155, 82, 108, 0.22) 0%, transparent 70%);
          border-radius: 50%;
          z-index: 1;
        }

        /* Opening Animation */
        .coquette-gift-box.opening .gift-lid {
          transform: translateY(-90px) rotateX(25deg) scale(1.08);
          opacity: 0.85;
        }

        .gift-burst-effect {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 10;
          animation: burstAnim 1.2s ease-out forwards;
        }

        @keyframes burstAnim {
          0% { transform: scale(0.6); opacity: 0; }
          40% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        @media (min-width: 640px) {
          .coquette-gift-box {
            width: 260px;
            height: 260px;
          }
          .gift-heading {
            font-size: 2.35rem;
          }
        }
      `}</style>
    </section>
  );
};


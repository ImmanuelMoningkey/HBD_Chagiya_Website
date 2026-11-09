import React, { useState, useEffect, useRef } from 'react';
import { MEDIA_CONFIG } from './data/content';
import { IntroScreen } from './components/IntroScreen';
import { PhotoAnimation } from './components/PhotoAnimation';
import { MysterySection } from './components/MysterySection';
import { InvestigationPage } from './components/InvestigationPage';
import { SurpriseIndicator } from './components/SurpriseIndicator';
import { GiftSection } from './components/GiftSection';
import { BirthdayModal } from './components/BirthdayModal';
import { MusicPlayer } from './components/MusicPlayer';
import { CoquetteBow, Sparkle, CuteHeart } from './components/DecorativeElements';

export function App() {
  // Website flow stages:
  // 1. 'intro' -> Opening Screen with button
  // 2. 'photo-anim' -> Floating memories photo animation
  // 3. 'main' -> Investigation hub with 3 mystery objects & gift section
  // 4. 'investigating' -> Detail page for one specific object
  const [currentStage, setCurrentStage] = useState('intro');
  const [selectedObjectId, setSelectedObjectId] = useState(null);

  // Music state
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Investigation tracking state: { matcha: bool, shades: bool, time: bool }
  const [openedObjects, setOpenedObjects] = useState({
    matcha: false,
    shades: false,
    time: false,
  });

  // Gift section and modal state
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isGiftSectionVisible, setIsGiftSectionVisible] = useState(false);
  const giftSectionRef = useRef(null);

  // Determine if all 3 objects have been opened
  const allObjectsOpened =
    openedObjects.matcha && openedObjects.shades && openedObjects.time;

  // IntersectionObserver to hide indicator once user scrolls to the gift section
  useEffect(() => {
    if (currentStage !== 'main' || !allObjectsOpened) return;

    const target = giftSectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsGiftSectionVisible(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [currentStage, allObjectsOpened]);

  // Stage Handlers
  const handleStartSurprise = () => {
    setIsMusicPlaying(true);
    setCurrentStage('photo-anim');
  };

  const handlePhotoAnimationComplete = () => {
    setCurrentStage('main');
  };

  const handleSelectObject = (id) => {
    setSelectedObjectId(id);
    // Mark as opened
    setOpenedObjects((prev) => ({
      ...prev,
      [id]: true,
    }));
    setCurrentStage('investigating');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToMain = () => {
    setSelectedObjectId(null);
    setCurrentStage('main');
  };

  const handleIndicatorClick = () => {
    if (giftSectionRef.current) {
      giftSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectedObject = MEDIA_CONFIG.mysteryObjects.find(
    (obj) => obj.id === selectedObjectId
  );

  return (
    <div className="coquette-app">
      {/* Background Music Player & floating control */}
      <MusicPlayer isPlaying={isMusicPlaying} />

      {/* STAGE 1: INTRO SCREEN */}
      {currentStage === 'intro' && (
        <IntroScreen onOpen={handleStartSurprise} />
      )}

      {/* STAGE 2: PHOTO INTRO ANIMATION */}
      {currentStage === 'photo-anim' && (
        <PhotoAnimation
          photos={MEDIA_CONFIG.introPhotos}
          onComplete={handlePhotoAnimationComplete}
        />
      )}

      {/* STAGE 4: OBJECT INVESTIGATION PAGE */}
      {currentStage === 'investigating' && selectedObject && (
        <InvestigationPage
          object={selectedObject}
          onBack={handleBackToMain}
        />
      )}

      {/* STAGE 3, 5, 6: MAIN HUB (3 Mystery Objects + Gift Section + Indicator) */}
      {currentStage === 'main' && (
        <main className="main-content-flow">
          {/* Subtle Top Coquette Banner */}
          <header className="coquette-top-header">
            <div className="header-bow-wrap">
              <CoquetteBow size={38} color="#E995B0" />
            </div>
            <span className="header-tag font-script">A little journey full of love</span>
          </header>

          {/* STAGE 3: Three Mystery Objects */}
          <MysterySection
            objects={MEDIA_CONFIG.mysteryObjects}
            openedObjects={openedObjects}
            onSelectObject={handleSelectObject}
          />

          {/* STAGE 5: Hidden Surprise Indicator (only if all 3 opened & gift section not yet reached) */}
          <SurpriseIndicator
            visible={allObjectsOpened && !isGiftSectionVisible}
            onClick={handleIndicatorClick}
          />

          {/* STAGE 6: The Final Gift Box */}
          <GiftSection
            sectionRef={giftSectionRef}
            onOpenGift={() => setIsGiftModalOpen(true)}
          />

          {/* Final Birthday Pop-Up Modal */}
          <BirthdayModal
            giftData={MEDIA_CONFIG.finalGift}
            isOpen={isGiftModalOpen}
            onClose={() => setIsGiftModalOpen(false)}
          />

          {/* Sweet Footer */}
          <footer className="coquette-footer">
            <CuteHeart size={16} color="#E995B0" />
            <span>Made with all the love in the world for Chagiya ♡</span>
            <CuteHeart size={16} color="#E995B0" />
          </footer>
        </main>
      )}

      <style>{`
        .coquette-app {
          min-height: 100vh;
          width: 100%;
          position: relative;
        }

        .main-content-flow {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          padding-bottom: 40px;
        }

        .coquette-top-header {
          padding-top: 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .header-tag {
          font-size: 1.7rem;
          color: var(--color-dusty-pink);
        }

        .coquette-footer {
          margin-top: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--color-dark-mauve);
          opacity: 0.75;
          text-align: center;
          padding: 0 16px;
        }
      `}</style>
    </div>
  );
}
export default App;


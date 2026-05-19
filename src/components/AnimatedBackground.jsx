import { useEffect, useRef, useState } from 'react';

const FALLBACK_IMG = '/assets/Zodarsfondo.png';

// Map screen → video file (in /assets/backgrounds/)
// If a file doesn't exist yet the video element fires onError and hides itself → fallback to previous/default
const SCREEN_VIDEOS = {
  default:  '/assets/backgrounds/bg_default.mp4',
  landing:  '/assets/backgrounds/bg_landing.mp4',
  auth:     '/assets/backgrounds/bg_landing.mp4',
  create:   '/assets/backgrounds/bg_create.mp4',
  game:     '/assets/backgrounds/bg_game.mp4',
  combat:   '/assets/backgrounds/bg_combat.mp4',
  dungeon:  '/assets/backgrounds/bg_dungeon.mp4',
  shop:     '/assets/backgrounds/bg_shop.mp4',
  master:   '/assets/backgrounds/bg_master.mp4',
};

function getVideoSrc(screen) {
  return SCREEN_VIDEOS[screen] || SCREEN_VIDEOS.default;
}

export default function AnimatedBackground({ screen = "default" }) {
  const [current, setCurrent]   = useState(getVideoSrc(screen));
  const [next, setNext]         = useState(null);
  const [fading, setFading]     = useState(false);
  const currentRef = useRef(null);
  const nextRef    = useRef(null);

  // When screen changes, start crossfade
  useEffect(() => {
    const src = getVideoSrc(screen);
    if (src === current) return;
    setNext(src);
    setFading(true);
  }, [screen]);

  // When next video is ready and fading, do the swap
  const handleNextCanPlay = () => {
    if (!fading || !nextRef.current) return;
    nextRef.current.muted = true;
    nextRef.current.play().catch(() => {});
  };

  const handleFadeEnd = () => {
    if (!fading) return;
    setCurrent(next);
    setNext(null);
    setFading(false);
  };

  // Play current on mount / src change
  useEffect(() => {
    const v = currentRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, [current]);

  const videoBase = {
    position: 'fixed',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    zIndex: -1,
    pointerEvents: 'none',
  };

  return (
    <>
      {/* Fallback image always behind */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: -2,
        backgroundImage: `url(${FALLBACK_IMG})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        pointerEvents: 'none',
      }} />

      {/* Current video */}
      <video
        key={current}
        ref={currentRef}
        autoPlay loop muted playsInline
        onError={e => { e.currentTarget.style.display = 'none'; }}
        style={{
          ...videoBase,
          opacity: fading ? 0 : 1,
          transition: fading ? 'opacity 1.2s ease' : 'none',
        }}
        onTransitionEnd={fading ? handleFadeEnd : undefined}
      >
        <source src={current} type="video/mp4" />
      </video>

      {/* Next video (fades in on top) */}
      {next && (
        <video
          key={next}
          ref={nextRef}
          autoPlay loop muted playsInline
          onCanPlay={handleNextCanPlay}
          onError={e => { e.currentTarget.style.display = 'none'; handleFadeEnd(); }}
          style={{
            ...videoBase,
            opacity: fading ? 1 : 0,
            transition: 'opacity 1.2s ease',
          }}
        >
          <source src={next} type="video/mp4" />
        </video>
      )}
    </>
  );
}

import { useEffect, useRef } from 'react';

const VIDEO_URL = '/assets/background.mp4';
const FALLBACK_URL = '/assets/Zodarsfondo.png';

export default function AnimatedBackground() {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        onError={e => { e.currentTarget.style.display = 'none'; }}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: -2,
        backgroundImage: `url(${FALLBACK_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        pointerEvents: 'none',
      }} />
    </>
  );
}

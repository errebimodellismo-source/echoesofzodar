const VIDEO_URL = '/assets/background.mp4';
const FALLBACK_URL = '/assets/Zodarsfondo.png';

export default function AnimatedBackground() {
  return (
    <>
      <video
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
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>
      {/* Fallback visible if video fails or not yet loaded */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        backgroundImage: `url(${FALLBACK_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        pointerEvents: 'none',
      }} />
    </>
  );
}

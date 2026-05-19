import { useEffect, useRef, useState, useCallback } from 'react';
import SimplePeer from 'simple-peer';

const STUN = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }] };
const SIGNAL_CHANNEL = 'voice_signal';

// Detect speaking via AudioContext volume
function useVolumeDetector(stream) {
  const [speaking, setSpeaking] = useState(false);
  const rafRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    if (!stream) return;
    try {
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      const check = () => {
        analyser.getByteFrequencyData(buf);
        const avg = buf.reduce((a, b) => a + b, 0) / buf.length;
        setSpeaking(avg > 12);
        rafRef.current = requestAnimationFrame(check);
      };
      rafRef.current = requestAnimationFrame(check);
    } catch {}
    return () => {
      cancelAnimationFrame(rafRef.current);
      ctxRef.current?.close();
    };
  }, [stream]);

  return speaking;
}

export default function VoiceChat({ myId, myName, partyCode, supabase, hasCrystal }) {
  const [active, setActive] = useState(false);
  const [muted, setMuted] = useState(false);
  const [peers, setPeers] = useState({}); // { peerId: { peer, stream, name } }
  const [speakingPeers, setSpeakingPeers] = useState(new Set());
  const [error, setError] = useState(null);

  const streamRef = useRef(null);
  const peersRef = useRef({});
  const channelRef = useRef(null);
  const audioRefs = useRef({});

  const isSpeaking = useVolumeDetector(active && !muted ? streamRef.current : null);

  const cleanup = useCallback(() => {
    Object.values(peersRef.current).forEach(({ peer }) => { try { peer.destroy(); } catch {} });
    peersRef.current = {};
    setPeers({});
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    channelRef.current?.unsubscribe();
    channelRef.current = null;
  }, []);

  const sendSignal = useCallback((toId, data) => {
    channelRef.current?.send({ type: 'broadcast', event: 'signal', payload: { from: myId, fromName: myName, to: toId, data } });
  }, [myId, myName]);

  const addPeer = useCallback((peerId, peerName, initiator, stream) => {
    if (peersRef.current[peerId]) return;
    const peer = new SimplePeer({ initiator, stream, config: STUN, trickle: true });

    peer.on('signal', data => sendSignal(peerId, data));

    peer.on('stream', remoteStream => {
      setPeers(p => ({ ...p, [peerId]: { ...p[peerId], stream: remoteStream, name: peerName } }));
      // Play remote audio
      let audio = audioRefs.current[peerId];
      if (!audio) {
        audio = new Audio();
        audio.autoplay = true;
        audioRefs.current[peerId] = audio;
      }
      audio.srcObject = remoteStream;
      // Detect remote speaking
      try {
        const ctx = new AudioContext();
        const src = ctx.createMediaStreamSource(remoteStream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        src.connect(analyser);
        const buf = new Uint8Array(analyser.frequencyBinCount);
        const check = () => {
          analyser.getByteFrequencyData(buf);
          const avg = buf.reduce((a, b) => a + b, 0) / buf.length;
          setSpeakingPeers(sp => {
            const next = new Set(sp);
            avg > 12 ? next.add(peerId) : next.delete(peerId);
            return next;
          });
          requestAnimationFrame(check);
        };
        requestAnimationFrame(check);
      } catch {}
    });

    peer.on('close', () => {
      setPeers(p => { const n = { ...p }; delete n[peerId]; return n; });
      delete peersRef.current[peerId];
      audioRefs.current[peerId]?.pause();
      delete audioRefs.current[peerId];
    });

    peer.on('error', () => {});

    peersRef.current[peerId] = { peer, name: peerName };
    setPeers(p => ({ ...p, [peerId]: { peer, name: peerName, stream: null } }));
    return peer;
  }, [sendSignal]);

  const join = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const channel = supabase.channel(`${SIGNAL_CHANNEL}:${partyCode}`, { config: { broadcast: { self: false } } });
      channelRef.current = channel;

      channel.on('broadcast', { event: 'signal' }, ({ payload }) => {
        if (payload.to !== myId) return;
        const { from, fromName, data } = payload;
        if (!peersRef.current[from]) {
          addPeer(from, fromName, false, streamRef.current);
        }
        peersRef.current[from]?.peer.signal(data);
      });

      channel.on('broadcast', { event: 'join' }, ({ payload }) => {
        if (payload.from === myId) return;
        // They joined → I initiate
        addPeer(payload.from, payload.fromName, true, streamRef.current);
      });

      channel.on('broadcast', { event: 'leave' }, ({ payload }) => {
        const p = peersRef.current[payload.from];
        if (p) { try { p.peer.destroy(); } catch {} }
        delete peersRef.current[payload.from];
        setPeers(prev => { const n = { ...prev }; delete n[payload.from]; return n; });
      });

      await new Promise(resolve => channel.subscribe(status => { if (status === 'SUBSCRIBED') resolve(); }));
      channel.send({ type: 'broadcast', event: 'join', payload: { from: myId, fromName: myName } });
      setActive(true);
    } catch (e) {
      setError(e.name === 'NotAllowedError' ? 'Permesso microfono negato.' : 'Errore connessione vocale.');
      streamRef.current?.getTracks().forEach(t => t.stop());
    }
  }, [myId, myName, partyCode, supabase, addPeer]);

  const leave = useCallback(() => {
    channelRef.current?.send({ type: 'broadcast', event: 'leave', payload: { from: myId } });
    cleanup();
    setActive(false);
    setError(null);
  }, [myId, cleanup]);

  const toggleMute = useCallback(() => {
    if (!streamRef.current) return;
    const enabled = !muted;
    streamRef.current.getAudioTracks().forEach(t => { t.enabled = enabled; });
    setMuted(!enabled);
  }, [muted]);

  useEffect(() => () => cleanup(), [cleanup]);

  if (!hasCrystal) return null;

  const peerList = Object.entries(peers);

  return (
    <div style={{ margin:'8px 0', userSelect:'none' }}>
      {!active ? (
        <div>
          <button onClick={join} style={{ width:'100%', padding:'0.55rem 0.9rem', background:'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.3))', border:'1px solid #6366f1', borderRadius:9, color:'#c4b5fd', fontFamily:"'Cinzel',serif", fontSize:'0.8rem', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, letterSpacing:'0.04em' }}>
            <span style={{ fontSize:'1.1rem' }}>💎</span> Cristallo della Sintonia
          </button>
          {error && <div style={{ fontSize:'0.72rem', color:'#f87171', marginTop:4, textAlign:'center' }}>{error}</div>}
        </div>
      ) : (
        <div style={{ background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.4)', borderRadius:10, padding:'0.6rem 0.8rem' }}>
          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom: peerList.length ? 8 : 0 }}>
            <span style={{ fontSize:'1rem' }}>💎</span>
            <span style={{ fontFamily:"'Cinzel',serif", color:'#a5b4fc', fontSize:'0.78rem', fontWeight:700, flex:1 }}>Cristallo della Sintonia</span>
            <button onClick={toggleMute} title={muted ? 'Attiva microfono' : 'Silenzia'} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'1rem', padding:2 }}>
              {muted ? '🔇' : isSpeaking ? '🔊' : '🎙️'}
            </button>
            <button onClick={leave} title="Esci dal canale" style={{ background:'none', border:'none', cursor:'pointer', fontSize:'0.85rem', color:'#f87171', padding:2 }}>✕</button>
          </div>

          {/* Self */}
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom: peerList.length ? 4 : 0 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background: isSpeaking && !muted ? '#22c55e' : muted ? '#ef4444' : '#475569', boxShadow: isSpeaking && !muted ? '0 0 6px #22c55e' : 'none', transition:'all 0.15s', flexShrink:0 }} />
            <span style={{ fontSize:'0.75rem', color:'#94a3b8' }}>{myName} {muted ? '(muto)' : ''}</span>
          </div>

          {/* Remote peers */}
          {peerList.map(([id, { name }]) => (
            <div key={id} style={{ display:'flex', alignItems:'center', gap:6, marginTop:3 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background: speakingPeers.has(id) ? '#22c55e' : '#475569', boxShadow: speakingPeers.has(id) ? '0 0 6px #22c55e' : 'none', transition:'all 0.15s', flexShrink:0 }} />
              <span style={{ fontSize:'0.75rem', color:'#e2d9c5' }}>{name || id.slice(0,8)}</span>
            </div>
          ))}

          {peerList.length === 0 && (
            <div style={{ fontSize:'0.7rem', color:'#475569', marginTop:2 }}>Nessun altro nel canale…</div>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import DiceBox from '@3d-dice/dice-box';
import audioManager from '../utils/audioManager';

const ROLL_TIMEOUT_MS = 7000;

function getDiceConfig() {
  const w = window.innerWidth;
  const isMobile = w <= 768;
  return {
    scale: isMobile ? 5 : 4,
    spinForce: isMobile ? 7 : 5,
    throwForce: isMobile ? 5.5 : 3.5,
    startingHeight: isMobile ? 12 : 8,
  };
}

const DiceRoller = forwardRef(({ onRollComplete }, ref) => {
  const containerRef = useRef(null);
  const [diceBox, setDiceBox] = useState(null);

  useEffect(() => {
    let box = null;
    let isMounted = true;
    const containerElement = containerRef.current;

    const initDice = async () => {
      try {
        const cfg = getDiceConfig();
        box = new DiceBox({
          container: "#dice-box-container",
          assetPath: '/assets/dice-box/',
          theme: 'default',
          themeColor: '#ef4444',
          scale: cfg.scale,
          size: 11,
          spinForce: cfg.spinForce,
          throwForce: cfg.throwForce,
          startingHeight: cfg.startingHeight,
          settleTimeout: 5500,
          lightIntensity: 0.9,
          gravity: 1,
        });

        await box.init();
        if(isMounted) setDiceBox(box);
      } catch (err) {
        console.error("Failed to initialize dice-box:", err);
      }
    };

    initDice();

    return () => {
      isMounted = false;
      if (box && containerElement) containerElement.innerHTML = '';
    };
  }, []);

  useImperativeHandle(ref, () => ({
    roll: async (notation = '1d20', themeColor = '#ef4444') => {
      if (!diceBox) {
        console.warn("DiceBox not initialized yet");
        if(onRollComplete) onRollComplete(null, null);
        return null;
      }

      audioManager.playSFX('diceRoll');
      diceBox.updateConfig({ themeColor });

      let timeoutId;
      try {
        diceBox.clear();
        const timeoutResult = Symbol("dice-roll-timeout");
        const results = await Promise.race([
          diceBox.roll(notation),
          new Promise(resolve => {
            timeoutId = window.setTimeout(() => resolve(timeoutResult), ROLL_TIMEOUT_MS);
          }),
        ]);

        window.clearTimeout(timeoutId);

        if (results === timeoutResult) {
          console.warn("Dice roll timed out");
          diceBox.clear();
          if(onRollComplete) onRollComplete(null, null);
          return null;
        }

        if (results) {
          const total = results.reduce((acc, roll) => acc + roll.value, 0);
          if(onRollComplete) onRollComplete(total, results);
          return total;
        }
        return null;
      } catch (e) {
        console.error("Dice roll failed:", e);
        window.clearTimeout(timeoutId);
        diceBox.clear();
        if(onRollComplete) onRollComplete(null, null);
        return null;
      }
    },
    clear: () => {
      if (diceBox) diceBox.clear();
    }
  }));

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 9999,
    }}>
      <div
        id="dice-box-container"
        ref={containerRef}
        style={{
          position: 'relative',
          width: isMobile ? '100vw' : 'min(600px, 90vw)',
          height: isMobile ? '100vh' : 'min(420px, 70vh)',
          overflow: 'hidden',
          borderRadius: isMobile ? 0 : 18,
        }}
      >
        <style>{`
          #dice-box-container canvas,
          #dice-box-container .dice-box-canvas {
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            display: block !important;
          }
        `}</style>
      </div>
    </div>
  );
});

export default DiceRoller;

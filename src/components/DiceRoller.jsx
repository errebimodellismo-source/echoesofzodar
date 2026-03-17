import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import DiceBox from '@3d-dice/dice-box';
import audioManager from '../utils/audioManager';

const DiceRoller = forwardRef(({ onRollComplete }, ref) => {
  const containerRef = useRef(null);
  const [diceBox, setDiceBox] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let box = null;
    let isMounted = true;
    
    const initDice = async () => {
      try {
        box = new DiceBox("#dice-box-container", {
          assetPath: '/assets/dice-box/', // Will fail over to unpkg if not found
          theme: 'default',
          themeColor: '#ef4444', 
          scale: 6,
          spinForce: 6,
          throwForce: 6,
          startingHeight: 8,
          settleTimeout: 5000,
          lightIntensity: 0.9,
          gravity: 2,
        });

        await box.init();
        if(isMounted) {
            setDiceBox(box);
            setIsInitializing(false);
        }

      } catch (err) {
        console.error("Failed to initialize dice-box:", err);
        if(isMounted) setIsInitializing(false);
      }
    };

    initDice();

    return () => {
      isMounted = false;
      if (box && containerRef.current) {
        containerRef.current.innerHTML = '';
      }
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
      
      try {
        diceBox.clear(); 
        const results = await diceBox.roll(notation);
        if (results) {
            const total = results.reduce((acc, roll) => acc + roll.value, 0);
            if(onRollComplete) onRollComplete(total, results);
            return total;
        }
        return null;
      } catch (e) {
        console.error("Dice roll failed:", e);
        if(onRollComplete) onRollComplete(null, null);
        return null;
      }
    },
    clear: () => {
      if (diceBox) diceBox.clear();
    }
  }));

  return (
    <div 
      id="dice-box-container"
      ref={containerRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none', 
        zIndex: 9999, 
      }}
    />
  );
});

export default DiceRoller;

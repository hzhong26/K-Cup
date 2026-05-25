import React, { useMemo } from 'react';
import { CardData, CardStatus, Suit, Theme } from '../types';

interface PlayingCardProps {
  card: CardData;
  totalCards: number;
  onClick: (card: CardData) => void;
  radius: number;
  theme: Theme;
  layoutMode?: 'circle' | 'stack';
  customOpacity?: number;
}

export const PlayingCard: React.FC<PlayingCardProps> = ({ 
  card, 
  totalCards, 
  onClick, 
  radius, 
  theme,
  layoutMode = 'circle',
  customOpacity
}) => {
  
  // Determine if the card is red or black
  const isRed = card.suit === Suit.Hearts || card.suit === Suit.Diamonds;
  
  // Logic for positioning
  const style = useMemo(() => {
    if (card.status === CardStatus.Removed) {
      // Circle mode: disappear to center (default behavior)
      if (layoutMode === 'circle') {
        return {
          opacity: 0,
          pointerEvents: 'none' as const,
          transform: 'translate(-50%, -50%) scale(0)',
          top: '50%',
          left: '50%',
          transition: 'all 0.6s ease-in',
        };
      }

      // Stack mode: Throw onto the table
      // Use customOpacity if provided, otherwise default to 0.25
      const opacity = customOpacity !== undefined ? customOpacity : 0.25;

      return {
        top: '50%',
        left: '50%',
        // Use the pre-calculated random positions
        transform: `translate(calc(-50% + ${card.discardX}px), calc(-50% + ${card.discardY}px)) rotate(${card.discardRotation}deg) scale(0.9)`,
        zIndex: 1, // Keep them below the active deck (which is usually index 10+)
        opacity, 
        pointerEvents: 'none' as const,
        transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)', // "Throw" easing
      };
    }

    if (card.status === CardStatus.Selected) {
      return {
        top: '50%',
        left: '50%',
        // Center card is neat and straight
        transform: 'translate(-50%, -50%) scale(1.25) rotate(0deg)',
        zIndex: 1000,
        opacity: 1,
        transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      };
    }

    // Default: In Circle or In Stack
    
    if (layoutMode === 'stack') {
       // Messy Pile Logic
       const offsetX = card.randomRadius;
       const offsetY = (card.randomRotation / 2); 
       
       return {
         top: '50%',
         left: '50%',
         transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) rotate(${card.randomRotation}deg)`,
         zIndex: 10 + card.layoutIndex, // Ensure deck sits above discarded cards (index 1 vs 10+)
         opacity: 1,
         transition: 'all 0.5s ease-out',
         cursor: 'pointer',
       };
    } else {
       // Circle Logic
       const safeTotal = totalCards || 1;
       const angleDeg = (card.layoutIndex / safeTotal) * 360;
       
       const messyRadius = radius + card.randomRadius;
       const messyRotation = -90 + card.randomRotation;
       
       return {
         top: '50%',
         left: '50%',
         transform: `translate(-50%, -50%) rotate(${angleDeg + 90}deg) translate(${messyRadius}px) rotate(${messyRotation}deg)`,
         zIndex: card.layoutIndex, 
         opacity: 1,
         transition: 'all 0.5s ease-out',
       };
    }

  }, [card.status, card.layoutIndex, card.randomRadius, card.randomRotation, card.discardX, card.discardY, card.discardRotation, totalCards, radius, layoutMode, customOpacity]);

  // Handle Card Click
  const handleClick = () => {
    onClick(card);
  };

  // Removed cards in stack mode should be face up (showing what was played)
  // Selected cards are face up
  // InCircle cards in stack mode are face down
  // InCircle cards in circle mode are face down
  const isFaceUp = card.status === CardStatus.Selected || (layoutMode === 'stack' && card.status === CardStatus.Removed);

  // Dynamic Theme State for transitions
  const isDark = theme === Theme.Dark;

  return (
    <div
      className={`absolute w-20 h-28 sm:w-24 sm:h-36 xl:w-32 xl:h-48 cursor-pointer select-none perspective-1000 ${layoutMode === 'stack' && card.status === CardStatus.InCircle ? 'hover:-translate-y-2 transition-transform' : ''}`}
      style={style as React.CSSProperties}
      onClick={handleClick}
    >
      <div 
        className={`relative w-full h-full duration-500 transform-style-3d shadow-xl rounded-lg ${
          isFaceUp ? 'rotate-y-180' : ''
        }`}
      >
        {/* Card Back Container */}
        <div className="absolute w-full h-full backface-hidden rounded-lg bg-black">
           
           {/* Dark Theme Back Layer */}
           <div className={`absolute inset-0 rounded-lg border border-white/40 bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.05)] transition-opacity duration-500 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
              <div className="w-full h-full p-1.5">
                <div className="w-full h-full border border-white/10 rounded opacity-40 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
              </div>
              <div className="absolute w-8 h-8 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm"></div>
           </div>

           {/* Classic Theme Back Layer */}
           <div className={`absolute inset-0 rounded-lg border border-blue-300/40 bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.3)] transition-opacity duration-500 ${!isDark ? 'opacity-100' : 'opacity-0'}`}>
              <div className="w-full h-full p-1.5">
                <div className="w-full h-full border border-white/10 rounded opacity-40 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
              </div>
              <div className="absolute w-8 h-8 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm"></div>
           </div>

        </div>

        {/* Card Front */}
        <div 
          className={`absolute w-full h-full backface-hidden rotate-y-180 rounded-lg bg-white border border-gray-200 flex flex-col justify-between p-2 shadow-md ${
            isRed ? 'text-red-600' : 'text-slate-900'
          }`}
        >
            {/* Top Corner */}
            <div className="flex flex-col items-center leading-none">
              <span className="font-card font-bold text-base sm:text-lg xl:text-2xl">{card.rank}</span>
              <span className="text-sm sm:text-base xl:text-lg">{card.suit}</span>
            </div>

            {/* Center Suit */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl sm:text-5xl xl:text-6xl opacity-20">{card.suit}</span>
            </div>

            {/* Bottom Corner (Rotated) */}
            <div className="flex flex-col items-center leading-none transform rotate-180">
              <span className="font-card font-bold text-base sm:text-lg xl:text-2xl">{card.rank}</span>
              <span className="text-sm sm:text-base xl:text-lg">{card.suit}</span>
            </div>
        </div>
      </div>
    </div>
  );
};
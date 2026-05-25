import React, { useState, useEffect, useCallback } from 'react';
import { generateDeck } from './utils/deck';
import { CardData, CardStatus, Theme } from './types';
import { PlayingCard } from './components/PlayingCard';
import { RulesSidebar } from './components/RulesSidebar';
import { CardRuleDisplay } from './components/CardRuleDisplay';
import { KINGS_CUP_RULES } from './utils/gameRules';

interface KingsCupGameProps {
  onBack: () => void;
}

export const KingsCupGame: React.FC<KingsCupGameProps> = ({ onBack }) => {
  const [deck, setDeck] = useState<CardData[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [theme, setTheme] = useState<Theme>(Theme.Dark);
  const [kingsCount, setKingsCount] = useState(0);

  // Animation States
  const [isPouring, setIsPouring] = useState(false); 
  const [isShaking, setIsShaking] = useState(false);
  
  // Lock input during the "Card Reveal" phase (before cup emerges)
  const [isSequenceLocked, setIsSequenceLocked] = useState(false);

  // Sidebar State
  const [showRules, setShowRules] = useState(false);

  // Initialize Game
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setDeck(generateDeck());
    setIsGameOver(false);
    setKingsCount(0);
    setIsPouring(false);
    setIsSequenceLocked(false);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === Theme.Dark ? Theme.Classic : Theme.Dark);
  };

  // Determine active card
  const activeCard = deck.find(c => c.status === CardStatus.Selected);
  const activeRule = activeCard ? KINGS_CUP_RULES.find(r => r.rank === activeCard.rank) : undefined;
  
  const handleCardClick = useCallback((clickedCard: CardData) => {
    // Prevent interaction if pouring or if we are in the delay sequence
    if (isPouring || isSequenceLocked) return;

    // 1. Clicking active card (Discard)
    if (clickedCard.status === CardStatus.Selected) {
       const removedCount = deck.filter(c => c.status === CardStatus.Removed).length;
       const newDeck = deck.map(c => 
          c.id === clickedCard.id ? { ...c, status: CardStatus.Removed, discardIndex: removedCount } : c
       );
       setDeck(newDeck);
       return;
    }

    // 2. Clicking circle card (Draw)
    if (clickedCard.status === CardStatus.InCircle) {
        const remainingCards = deck.filter(c => c.status === CardStatus.InCircle);
        // Find top card
        const topCard = remainingCards.reduce((prev, current) => 
          (prev.layoutIndex > current.layoutIndex) ? prev : current
        , remainingCards[0]);

        if (!topCard) return;

        // Draw Logic
        const removedCount = deck.filter(c => c.status === CardStatus.Removed).length;
        
        // Auto-discard current center card
        const deckWithRemoved = deck.map(c => 
           c.status === CardStatus.Selected ? { ...c, status: CardStatus.Removed, discardIndex: removedCount } : c
        );

        // Select new top card
        const newDeck = deckWithRemoved.map(c => 
          c.id === topCard.id ? { ...c, status: CardStatus.Selected } : c
        );

        setDeck(newDeck);

        // Check for King Special Sequence
        if (topCard.rank === 'K') {
          // Lock input immediately so user watches the card
          setIsSequenceLocked(true);
          
          // Trigger background shake feedback
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 800);

          setKingsCount(prev => {
            const newCount = prev + 1;
            
            // DELAY SEQUENCE:
            // 1. Show Card (0s - 1.5s)
            // 2. Start Cup Animation (1.5s)
            const revealDuration = 1500;

            if (newCount < 4) {
               setTimeout(() => {
                 setIsPouring(true);
                 // Unlock "Sequence" so user can click the Cup (but card clicks are still blocked by isPouring)
                 setIsSequenceLocked(false); 
               }, revealDuration);
            } else {
               // 4th King: Game Over
               setTimeout(() => {
                  setIsGameOver(true);
                  setIsSequenceLocked(false);
               }, revealDuration + 500);
            }

            return newCount;
          });
        }
        
        // Check Empty Deck
        if (remainingCards.length <= 1) { 
           setIsGameOver(true);
        }
    }
  }, [deck, isPouring, isSequenceLocked]);

  const handleCupClick = () => {
    if (isPouring) {
      setIsPouring(false);
    }
  };

  const remainingCount = deck.filter(c => c.status === CardStatus.InCircle).length;
  const totalRemovedCount = deck.filter(c => c.status === CardStatus.Removed).length;

  const isDark = theme === Theme.Dark;
  
  const textMainClass = isDark ? "text-red-50" : "text-amber-900"; 
  const textSubClass = isDark ? "text-red-200/60" : "text-amber-800/60";
  
  const btnClass = isDark 
    ? "border-red-500/30 text-red-100 hover:bg-red-500/10 hover:text-white hover:border-red-400"
    : "border-amber-900/20 text-amber-900 hover:bg-amber-900/5 hover:border-amber-900/40";

  // Cup Liquid Calculation
  const liquidHeight = (kingsCount / 4) * 60; 
  const liquidY = 80 - liquidHeight;
  const cupPathD = "M20,20 Q20,60 50,80 Q80,60 80,20 L90,10 L10,10 Z";

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center bg-black">
      
      {/* Background Layers */}
      <div 
        className={`absolute inset-0 bg-[#2b0a0a] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#451010] via-[#200505] to-black transition-opacity duration-500 ease-in-out ${isDark ? 'opacity-100' : 'opacity-0'}`} 
      />
      <div 
        className={`absolute inset-0 bg-[#fdf2f2] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#fce7e7] to-[#e6caca] transition-opacity duration-500 ease-in-out ${!isDark ? 'opacity-100' : 'opacity-0'}`} 
      />
      
      {/* Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.2] bg-[url('https://www.transparenttextures.com/patterns/felt.png')] z-0"></div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/royal.png')] z-0"></div>

      {/* 
         CENTER CUP GRAPHIC 
         Animation Logic:
         - Duration: 3000ms (Slow emergence) when pouring
         - Duration: 1000ms (Faster retreat) when resuming
         - Timing: Ease-in-out (Gradual start/end)
         - Z-Index: Pops to front when isPouring becomes true (after 2s delay)
      */}
      <div 
        onClick={handleCupClick}
        className={`absolute top-1/2 left-1/2 transition-all ${isPouring ? 'duration-[3000ms]' : 'duration-1000'}
        ${isPouring 
           ? 'opacity-100 z-[2000] cursor-pointer drop-shadow-[0_0_60px_rgba(255,255,255,0.2)]' 
           : activeCard 
             ? 'opacity-30 z-0 pointer-events-none grayscale-[0.6]' 
             : 'opacity-50 z-0 pointer-events-none grayscale-[0.3]'
        }
        `}
        style={{
            transitionTimingFunction: 'ease-in-out',
            transform: isPouring 
                ? 'translate(-50%, -50%) scale(1.3)' 
                : 'translate(-50%, -35%) scale(0.9)', 
        }}
      >
         {/* Inner Container for Shake Animation */}
         <div className={`transition-transform duration-300 ${isShaking ? 'animate-[bounce_0.5s_infinite]' : ''}`}>
            <svg width="min(80vw, 800px)" height="min(80vh, 1000px)" viewBox="0 0 100 100" className="drop-shadow-2xl overflow-visible">
                <defs>
                <clipPath id="cupClip">
                    <path d={cupPathD} />
                </clipPath>
                <linearGradient id="liquidGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={isDark ? '#ef4444' : '#d97706'} />
                    <stop offset="100%" stopColor={isDark ? '#7f1d1d' : '#92400e'} />
                </linearGradient>
                </defs>

                {/* Glass Back */}
                <path d={cupPathD} className={`stroke-2 transition-colors duration-500 ${isDark ? 'fill-red-900/20 stroke-red-500/30' : 'fill-amber-500/5 stroke-amber-900/20'}`} />

                {/* Liquid Level */}
                <rect 
                x="0" 
                y={liquidY} 
                width="100" 
                height={liquidHeight} 
                clipPath="url(#cupClip)"
                className="transition-all duration-[2000ms] ease-in-out"
                fill="url(#liquidGradient)"
                opacity={kingsCount === 4 ? 0.9 : 0.8}
                />

                {/* Glass Front Reflection/Detail */}
                <path d="M25,25 Q25,55 50,75" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1" />
                <rect x="45" y="80" width="10" height="15" className={`transition-colors duration-500 ${isDark ? 'fill-red-900/40' : 'fill-amber-900/20'}`} />
                <path d="M30,95 L70,95 L60,85 L40,85 Z" className={`transition-colors duration-500 ${isDark ? 'fill-red-900/40' : 'fill-amber-900/20'}`} />
            </svg>

            {/* "Click to Resume" hint attached to cup when pouring */}
            <div className={`absolute bottom-0 left-0 w-full text-center transition-all duration-1000 delay-1000 ${isPouring ? 'opacity-100 translate-y-8' : 'opacity-0 translate-y-4'}`}>
                <span className="text-white/60 text-xs uppercase tracking-[0.3em] bg-black/50 px-4 py-1 rounded-full backdrop-blur-sm border border-white/10">
                Click Cup to Continue
                </span>
            </div>
         </div>
      </div>

      {/* Pour Message Notification */}
      <div className={`absolute top-[20%] left-0 w-full flex flex-col items-center justify-center z-[2100] pointer-events-none transition-all ${isPouring ? 'duration-[2000ms]' : 'duration-500'} ease-out ${isPouring ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
           <div className="bg-black/60 backdrop-blur-md text-white border border-red-500/30 px-10 py-6 rounded-2xl shadow-2xl max-w-lg text-center">
              <h3 className="text-red-400 text-sm uppercase tracking-[0.4em] mb-2 font-bold">King Drawn</h3>
              <div className="text-3xl md:text-5xl font-card font-bold text-center tracking-wider text-red-50 drop-shadow-[0_2px_10px_rgba(255,50,50,0.5)]">
                 Pour drink into the cup
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-6"></div>
           </div>
      </div>

      {/* Header */}
      <div className={`absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10 pointer-events-none transition-all duration-1000 ${isPouring ? 'opacity-0 -translate-y-4' : 'opacity-100'} ${textMainClass}`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className={`pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full border border-current bg-white/5 hover:bg-white/10 transition-colors opacity-60 hover:opacity-100`}
            title="Back to Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-wider uppercase drop-shadow-md font-card">King's Cup</h1>
            <p className={`text-sm mt-2 font-light tracking-wide transition-colors duration-500 ${textSubClass}`}>
               {activeCard ? `Card Rules: ${activeCard.rank}` : "Draw a card from the deck"}
            </p>
          </div>
        </div>
        
        <div className="text-right pointer-events-auto">
          {/* Kings Counter */}
          <div className="flex flex-col items-end mb-4">
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-4 h-4 rounded-full border border-current transition-all duration-500 ${i < kingsCount ? (isDark ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-red-600') : 'bg-transparent opacity-30'}`}
                />
              ))}
            </div>
            <div className={`text-xs uppercase tracking-widest mt-1 opacity-70 ${textSubClass}`}>Kings Drawn</div>
          </div>

          <div className="text-5xl font-bold font-card drop-shadow-lg">{remainingCount}</div>
          <div className={`text-xs uppercase tracking-widest mb-4 opacity-70 transition-colors duration-500 ${textSubClass}`}>Cards Left</div>
          
          <div className="flex gap-3 justify-end items-center">
             <button 
              onClick={toggleTheme}
              className={`w-10 h-10 flex items-center justify-center rounded-full border text-xs transition-all duration-500 shadow-lg backdrop-blur-sm ${btnClass}`}
              title="Switch Theme"
            >
              <div className="relative w-4 h-4">
                 <div className={`absolute inset-0 transition-opacity duration-500 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                 </div>
                 <div className={`absolute inset-0 transition-opacity duration-500 ${!isDark ? 'opacity-100' : 'opacity-0'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                 </div>
              </div>
            </button>

            <button 
              onClick={() => setShowRules(true)}
              className={`px-6 py-2 border rounded-full text-xs uppercase tracking-widest transition-all duration-500 font-semibold shadow-lg backdrop-blur-sm ${btnClass}`}
            >
              Rules
            </button>
            <button 
              onClick={startNewGame}
              className={`px-6 py-2 border rounded-full text-xs uppercase tracking-widest transition-all duration-500 font-semibold shadow-lg backdrop-blur-sm ${btnClass}`}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Game Area - Cards */}
      {/* If pouring, we blur the cards to focus on the cup */}
      <div className={`relative w-full h-full flex items-center justify-center transition-all ${isPouring ? 'duration-[3000ms]' : 'duration-1000'} ${isPouring ? 'blur-md opacity-40 pointer-events-none' : ''}`}>
        {/* Render Cards */}
        {deck.map((card) => {
          // Calculate opacity for Removed cards
          let customOpacity = undefined;
          if (card.status === CardStatus.Removed && card.discardIndex !== -1) {
            // How far back is this card?
            const age = totalRemovedCount - 1 - card.discardIndex;
            
            // Fading logic
            const baseOpacity = 0.4;
            const fadeStep = 0.08; 
            customOpacity = Math.max(0, baseOpacity - (age * fadeStep));
          }

          return (
            <PlayingCard
              key={card.id}
              card={card}
              totalCards={52}
              onClick={handleCardClick}
              radius={0} // Not used in stack mode
              theme={theme}
              layoutMode="stack"
              customOpacity={customOpacity}
            />
          );
        })}

        {/* Empty Deck State (if all drawn but game not over/modal showing) */}
        {remainingCount === 0 && !activeCard && (
           <div className={`text-xl opacity-50 font-card italic ${textMainClass}`}>Deck Empty</div>
        )}
      </div>

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center z-[3000]">
          {/* Deep Dark Backdrop with heavy blur */}
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-in fade-in duration-1000"></div>

          <div className="relative z-10 max-w-sm w-full mx-6 animate-in zoom-in-95 slide-in-from-bottom-8 duration-700">
             {/* Card Container */}
             <div className="relative bg-zinc-900/90 border border-white/10 rounded-3xl p-10 text-center shadow-2xl overflow-hidden">
                
                {/* Ambient Red Glow */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-900/20 blur-[80px] pointer-events-none"></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center">
                    {/* Crown */}
                    <div className="text-6xl mb-8 drop-shadow-[0_0_20px_rgba(220,38,38,0.4)] animate-pulse">
                      👑
                    </div>

                    {/* Title */}
                    <h2 className="text-4xl font-card text-white mb-2 tracking-wide">
                      The 4th King!
                    </h2>

                    {/* Divider */}
                    <div className="w-12 h-px bg-red-500/30 my-6"></div>

                    {/* Subtitle & Description */}
                    <div className="mb-10 space-y-3">
                      <p className="text-xs font-bold tracking-[0.25em] uppercase text-red-400">
                        The Cup Is Yours
                      </p>
                      <p className="text-lg text-zinc-400 font-serif italic">
                        Drink the entire contents of the center cup.
                      </p>
                    </div>

                    {/* Button */}
                    <button
                      onClick={startNewGame}
                      className="group relative w-full py-4 rounded-xl border border-white/10 bg-white/5 overflow-hidden transition-all duration-500 hover:bg-red-600 hover:border-red-500 active:scale-95"
                    >
                      <span className="relative z-10 text-xs font-bold tracking-[0.2em] uppercase text-white/70 group-hover:text-white transition-colors">
                        New Round
                      </span>
                    </button>
                </div>
             </div>
          </div>
        </div>
      )}
      
      {/* Active Card Rule Display */}
      <CardRuleDisplay rule={activeRule} theme={theme} />

      {/* Rules Sidebar */}
      <RulesSidebar isOpen={showRules} onClose={() => setShowRules(false)} theme={theme} rules={KINGS_CUP_RULES} title="King's Cup Rules" />

      {/* Instructions Overlay */}
      {!isGameOver && !isPouring && (
        <div className={`absolute bottom-8 text-center pointer-events-none opacity-40 text-xs tracking-[0.3em] uppercase font-light transition-colors duration-500 ${textSubClass}`}>
          Draw a card &bull; Follow the rules
        </div>
      )}
    </div>
  );
};
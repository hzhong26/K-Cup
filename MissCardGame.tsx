import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { generateDeck } from './utils/deck';
import { CardData, CardStatus, Theme } from './types';
import { PlayingCard } from './components/PlayingCard';
import { RulesSidebar } from './components/RulesSidebar';
import { CardRuleDisplay } from './components/CardRuleDisplay';
import { MISS_CARD_RULES } from './utils/gameRules';

interface MissCardGameProps {
  onBack: () => void;
}

export const MissCardGame: React.FC<MissCardGameProps> = ({ onBack }) => {
  const [deck, setDeck] = useState<CardData[]>([]);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [theme, setTheme] = useState<Theme>(Theme.Dark);
  
  // New States for Gap mechanics
  const [isChainBroken, setIsChainBroken] = useState(false);
  const [layoutTotal, setLayoutTotal] = useState(52); // Tracks the "size" of the virtual circle slots
  
  // State for Visual Radius Ratio (controls shrinking step-wise)
  const [radiusRatio, setRadiusRatio] = useState(0.22);

  // Sidebar State
  const [showRules, setShowRules] = useState(false);

  // Initialize Game
  useEffect(() => {
    startNewGame();
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startNewGame = () => {
    setDeck(generateDeck());
    setIsGameOver(false);
    setIsChainBroken(false);
    setLayoutTotal(52);
    setRadiusRatio(0.22); // Reset to default size
  };

  const toggleTheme = () => {
    setTheme(prev => prev === Theme.Dark ? Theme.Classic : Theme.Dark);
  };

  // Determine if input is blocked
  const centerCard = deck.find(c => c.status === CardStatus.Selected);
  const activeRule = centerCard ? MISS_CARD_RULES.find(r => r.rank === centerCard.rank) : undefined;
  
  // Helper to determine card width based on screen width (matching Tailwind classes in PlayingCard)
  const getCardWidth = (screenWidth: number) => {
    if (screenWidth >= 1280) return 128; // xl:w-32
    if (screenWidth >= 640) return 96;  // sm:w-24
    return 80;                           // w-20
  };

  const cardWidth = useMemo(() => getCardWidth(windowSize.width), [windowSize.width]);

  // Dynamic Radius Calculation
  const currentRadius = useMemo(() => {
    const minDim = Math.min(windowSize.width, windowSize.height);
    
    // 1. Visual Preference:
    // Controlled by state `radiusRatio` which updates only when chain is fixed.
    const visualRadius = minDim * radiusRatio;

    // 2. Connectivity Constraint:
    // We use a safe gap of 1.15x width for the layout calculation.
    const safeGap = 1.15 * cardWidth;
    const maxRadiusForConnectivity = (Math.max(layoutTotal, 2) * safeGap) / (2 * Math.PI);

    return Math.min(visualRadius, maxRadiusForConnectivity);
  }, [windowSize, layoutTotal, cardWidth, radiusRatio]);

  // Check for gaps whenever the deck changes
  useEffect(() => {
    if (isGameOver || deck.length === 0) return;

    // We only check for breaks if the chain isn't already reported as broken
    if (!isChainBroken) {
      const broken = checkChainStatus(deck, layoutTotal, currentRadius, cardWidth);
      if (broken) {
        setIsChainBroken(true);
      }
    }
  }, [deck, layoutTotal, windowSize, isGameOver, isChainBroken, currentRadius, cardWidth]);

  const checkChainStatus = (
    currentDeck: CardData[], 
    currentLayoutTotal: number, 
    radius: number,
    currentCardWidth: number
  ) => {
    const activeCards = currentDeck.filter(c => c.status === CardStatus.InCircle)
                                   .sort((a, b) => a.layoutIndex - b.layoutIndex);
    
    if (activeCards.length < 2) return false;

    const anglePerSlotRad = (2 * Math.PI) / currentLayoutTotal;
    
    // Detection Threshold: 
    // 1.28x width is strict enough to catch gaps but loose enough to tolerate some rotation.
    const CARD_WIDTH_THRESHOLD = currentCardWidth * 1.28; 

    for (let i = 0; i < activeCards.length; i++) {
      const current = activeCards[i];
      const next = activeCards[(i + 1) % activeCards.length];
      
      let indexDiff = next.layoutIndex - current.layoutIndex;
      if (indexDiff < 0) indexDiff += currentLayoutTotal; // Wrap around for last -> first
      
      const angleTheta = indexDiff * anglePerSlotRad;
      
      // Calculate actual Euclidean distance between card centers using Law of Cosines
      // This accounts for the random radius offsets ("messiness")
      const r1 = radius + current.randomRadius;
      const r2 = radius + next.randomRadius;
      
      // d² = r1² + r2² - 2*r1*r2*cos(θ)
      const distSq = (r1 * r1) + (r2 * r2) - (2 * r1 * r2 * Math.cos(angleTheta));
      const distance = Math.sqrt(distSq);
      
      if (distance > CARD_WIDTH_THRESHOLD) {
        return true;
      }
    }
    return false;
  };

  const fixChain = () => {
    // 1. Calculate new layout based on currently active cards
    const activeCards = deck.filter(c => c.status === CardStatus.InCircle)
                            .sort((a, b) => a.layoutIndex - b.layoutIndex);
    
    const count = activeCards.length;
    
    // 2. Determine new Radius Ratio based on thresholds
    // Only shrink when fixing the chain, not during play.
    let newRatio = 0.22;
    if (count <= 10) newRatio = 0.16;
    else if (count <= 15) newRatio = 0.18;
    else if (count <= 20) newRatio = 0.20;
    
    setRadiusRatio(newRatio);

    // 3. Update Layout Total (this will trigger radius update for the NEW layout)
    setLayoutTotal(count);

    // 4. Re-index cards to close gaps
    setDeck(currentDeck => {
      const idToNewIndex = new Map<string, number>();
      activeCards.forEach((card, idx) => {
        idToNewIndex.set(card.id, idx);
      });

      return currentDeck.map(c => {
        if (c.status === CardStatus.InCircle && idToNewIndex.has(c.id)) {
          return { ...c, layoutIndex: idToNewIndex.get(c.id)! };
        }
        return c;
      });
    });
    
    setIsChainBroken(false);
  };

  const handleCardClick = useCallback((clickedCard: CardData) => {
    if (isChainBroken) return; // Block interaction if chain is broken

    setDeck(currentDeck => {
      if (clickedCard.status === CardStatus.Selected) {
        const newDeck = currentDeck.map(c => 
          c.id === clickedCard.id ? { ...c, status: CardStatus.Removed } : c
        );
        
        const remaining = newDeck.filter(c => c.status !== CardStatus.Removed).length;
        if (remaining === 0) {
          setIsGameOver(true);
        }
        return newDeck;
      }

      if (clickedCard.status === CardStatus.InCircle) {
        const isCenterOccupied = currentDeck.some(c => c.status === CardStatus.Selected);
        if (isCenterOccupied) {
          return currentDeck;
        }

        return currentDeck.map(c => 
          c.id === clickedCard.id ? { ...c, status: CardStatus.Selected } : c
        );
      }

      return currentDeck;
    });
  }, [isChainBroken]);

  const remainingCount = deck.filter(c => c.status !== CardStatus.Removed).length;

  const isDark = theme === Theme.Dark;
  
  const textMainClass = isDark ? "text-white" : "text-green-50";
  const textSubClass = isDark ? "text-zinc-300" : "text-green-200/80";
  
  const btnClass = isDark 
    ? "border-white/40 text-white hover:bg-white hover:text-black hover:border-white"
    : "border-green-300/40 text-green-100 hover:bg-green-100 hover:text-green-900 hover:border-green-100";

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center bg-black">
      
      {/* Background Layers */}
      <div 
        className={`absolute inset-0 bg-zinc-950 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-black transition-opacity duration-500 ease-in-out ${isDark ? 'opacity-100' : 'opacity-0'}`} 
      />
      <div 
        className={`absolute inset-0 bg-[#1e3a29] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#2a5236] to-[#0f1f14] transition-opacity duration-500 ease-in-out ${!isDark ? 'opacity-100' : 'opacity-0'}`} 
      />
      <div className="absolute inset-0 pointer-events-none opacity-[0.15] bg-[url('https://www.transparenttextures.com/patterns/felt.png')] z-0"></div>

      {/* Header */}
      <div className={`absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10 pointer-events-none transition-colors duration-500 ${textMainClass}`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className={`pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-colors ${textMainClass}`}
            title="Back to Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-wider uppercase drop-shadow-md">小姐牌</h1>
            <p className={`text-sm mt-2 font-light tracking-wide transition-colors duration-500 ${textSubClass}`}>
              {isChainBroken 
                ? "The circle is broken!" 
                : centerCard 
                  ? "Click the center card to discard it." 
                  : "Pick a card from the circle."}
            </p>
          </div>
        </div>
        
        <div className="text-right pointer-events-auto">
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

      {/* Game Area */}
      <div className="relative w-full h-full">
        {deck.map((card) => (
          <PlayingCard
            key={card.id}
            card={card}
            totalCards={layoutTotal}
            onClick={handleCardClick}
            radius={currentRadius}
            theme={theme}
          />
        ))}
      </div>

      {/* Chain Broken Notification */}
      {isChainBroken && !isGameOver && (
        <div 
          className="absolute inset-0 flex items-center justify-center animate-in fade-in duration-300 pointer-events-auto"
          style={{ zIndex: 1000 }}
        >
           <button 
             onClick={fixChain}
             className="relative group cursor-pointer transform transition-transform active:scale-95 flex flex-col items-center"
           >
             <div className="absolute inset-0 bg-red-500/10 blur-2xl rounded-full animate-pulse"></div>
             
             <div className="relative px-10 py-5 bg-black/80 border border-white/20 text-red-400 font-bold text-2xl uppercase tracking-[0.2em] rounded-xl shadow-2xl mb-4 backdrop-blur-md">
               Chain Broken
             </div>
             
             <div className="relative">
               <span className="inline-block bg-white text-black font-bold text-sm uppercase tracking-widest px-6 py-2 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:bg-zinc-200 transition-colors">
                 Click to fix
               </span>
             </div>
           </button>
        </div>
      )}

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-700" style={{ zIndex: 2000 }}>
          <div className="bg-zinc-900 border border-white/20 text-white p-10 rounded-2xl shadow-2xl text-center max-w-md mx-4 transform transition-all scale-100">
            <h2 className="text-4xl font-bold mb-3 font-card text-white">Table Cleared</h2>
            <p className="text-zinc-400 mb-8 text-lg font-light">You have successfully removed all 52 cards.</p>
            <button
              onClick={startNewGame}
              className="px-10 py-3 bg-white text-black rounded-full font-bold uppercase tracking-wide hover:bg-zinc-200 transition-transform active:scale-95 shadow-xl"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
      
      {/* Active Card Rule Display */}
      <CardRuleDisplay rule={activeRule} theme={theme} />

      {/* Rules Sidebar */}
      <RulesSidebar isOpen={showRules} onClose={() => setShowRules(false)} theme={theme} rules={MISS_CARD_RULES} title="Miss Card Rules" />

      {/* Instructions Overlay */}
      {!isGameOver && !isChainBroken && (
        <div className={`absolute bottom-8 text-center pointer-events-none opacity-40 text-xs tracking-[0.3em] uppercase font-light transition-colors duration-500 ${textSubClass}`}>
          Table Top Simulator &bull; 52 Deck Standard
        </div>
      )}
    </div>
  );
};
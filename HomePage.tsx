import React from 'react';

interface HomePageProps {
  onPlayMissCard: () => void;
  onPlayKingsCup: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onPlayMissCard, onPlayKingsCup }) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col items-center bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-zinc-950 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-black opacity-100" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.15] bg-[url('https://www.transparenttextures.com/patterns/felt.png')] z-0"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 flex flex-col items-center">
        
        {/* Hero Section */}
        <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent drop-shadow-sm font-card">
            Table Top
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 font-light tracking-wide max-w-2xl mx-auto">
            A curated collection of social card games designed for moments of connection.
          </p>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          
          {/* Miss Card Game Card */}
          <div 
            onClick={onPlayMissCard}
            className="group relative h-80 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10 p-1 overflow-hidden cursor-pointer hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-green-900/10 hover:-translate-y-1"
          >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-green-500/10 to-transparent transition-opacity duration-500"></div>
            
            <div className="relative h-full rounded-xl bg-zinc-900 overflow-hidden flex flex-col">
              {/* Card Image / Preview */}
              <div className="h-40 bg-[#1e3a29] relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/felt.png')]"></div>
                 {/* Decorative Circle of cards hint */}
                 <div className="w-24 h-24 rounded-full border-4 border-white/10 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-2 border-white/20"></div>
                 </div>
              </div>
              
              {/* Card Content */}
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-2xl font-bold font-card text-white mb-2 group-hover:text-green-200 transition-colors">小姐牌</h3>
                  <h4 className="text-xs uppercase tracking-widest text-zinc-500 mb-3">Miss Card</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    The classic social drinking game. Draw from the circle, follow the rules, and don't break the chain.
                  </p>
                </div>
                
                <div className="flex items-center text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-green-400 transition-colors mt-4">
                  <span>Play Now</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* King's Cup Game Card */}
          <div 
            onClick={onPlayKingsCup}
            className="group relative h-80 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10 p-1 overflow-hidden cursor-pointer hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/10 hover:-translate-y-1"
          >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-red-500/10 to-transparent transition-opacity duration-500"></div>
            
            <div className="relative h-full rounded-xl bg-zinc-900 overflow-hidden flex flex-col">
              {/* Card Image / Preview */}
              <div className="h-40 bg-[#3a1e1e] relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/felt.png')]"></div>
                 {/* Decorative Cup hint */}
                 <div className="w-20 h-24 border-4 border-white/10 rounded-b-xl flex items-center justify-center relative">
                    <div className="absolute top-2 w-full h-1 bg-white/10"></div>
                    <span className="text-3xl">👑</span>
                 </div>
              </div>
              
              {/* Card Content */}
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-2xl font-bold font-card text-white mb-2 group-hover:text-red-200 transition-colors">King's Cup</h3>
                  <h4 className="text-xs uppercase tracking-widest text-zinc-500 mb-3">Ring of Fire</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    The most popular drinking game. Features the King's Cup, waterfalls, and rule making.
                  </p>
                </div>
                
                <div className="flex items-center text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-red-400 transition-colors mt-4">
                  <span>Play Now</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

           {/* Coming Soon Card 2 */}
           <div className="relative h-80 rounded-2xl border border-white/5 bg-zinc-900/30 p-8 flex flex-col items-center justify-center text-center grayscale opacity-50 cursor-not-allowed">
            <div className="w-16 h-16 rounded-full bg-white/5 mb-6 flex items-center justify-center">
               <span className="text-2xl">🎲</span>
            </div>
            <h3 className="text-xl font-bold text-zinc-500 mb-2">Liar's Dice</h3>
            <p className="text-sm text-zinc-600">Coming Soon</p>
          </div>

        </div>

      </div>
      
      {/* Footer */}
      <div className="absolute bottom-6 text-zinc-600 text-xs uppercase tracking-[0.2em] opacity-50">
        Table Top Simulator &copy; 2024
      </div>
    </div>
  );
};
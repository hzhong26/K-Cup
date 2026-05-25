import React from 'react';
import { Theme } from '../types';
import { GameRule } from '../utils/gameRules';

interface RulesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  rules: GameRule[];
  title?: string;
}

export const RulesSidebar: React.FC<RulesSidebarProps> = ({ isOpen, onClose, theme, rules, title = "Game Rules" }) => {
  const isDark = theme === Theme.Dark;

  // Theme Configs
  const bgClass = isDark ? "bg-zinc-900 border-white/10" : "bg-[#1a2e1a] border-green-700/50";
  const headerBg = isDark ? "bg-zinc-900/95 border-white/10" : "bg-[#1a2e1a]/95 border-green-700/30";
  const textTitle = "text-white";
  const iconColor = isDark ? "text-white/70 hover:text-white hover:bg-white/10" : "text-green-100/70 hover:text-white hover:bg-green-700/30";
  
  const cardBg = isDark ? "bg-black/20 border-white/10 hover:border-amber-400/50 hover:bg-black/40" : "bg-black/10 border-green-700/30 hover:border-amber-300/50 hover:bg-black/20";
  const rankBox = isDark ? "bg-zinc-800 text-white" : "bg-[#2a5236] text-green-50";
  const titleColor = isDark ? "text-amber-400 group-hover:text-amber-300" : "text-amber-300 group-hover:text-amber-200";
  const descColor = isDark ? "text-zinc-400 group-hover:text-zinc-300" : "text-green-100/70 group-hover:text-green-50";

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-[3000] ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 border-l shadow-2xl z-[3001] transform transition-all duration-500 ease-out overflow-y-auto ${bgClass} ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className={`flex justify-between items-center mb-6 sticky top-0 backdrop-blur py-4 z-10 border-b transition-colors duration-500 ${headerBg}`}>
            <h2 className={`text-xl font-bold font-card tracking-widest uppercase transition-colors duration-500 ${textTitle}`}>{title}</h2>
            <button 
              onClick={onClose} 
              className={`p-2 rounded-full transition-all duration-500 ${iconColor}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Rules List */}
          <div className="space-y-3 pb-10">
            {rules.map((rule) => (
              <div key={rule.rank} className={`p-4 rounded-lg border transition-all duration-500 group ${cardBg}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center font-card font-bold text-xl rounded shadow-md group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-500 ${rankBox}`}>
                    {rule.rank}
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm mb-1 uppercase tracking-wide transition-colors duration-500 ${titleColor}`}>{rule.title}</h3>
                    <p className={`text-xs leading-relaxed transition-colors duration-500 ${descColor}`}>{rule.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center text-xs text-white/30 uppercase tracking-widest transition-colors duration-500">
            Tap outside to close
          </div>
        </div>
      </div>
    </>
  );
};
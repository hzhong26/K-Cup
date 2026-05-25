import React from 'react';
import { Theme } from '../types';
import { GameRule } from '../utils/gameRules';

interface CardRuleDisplayProps {
  rule: GameRule | undefined;
  theme: Theme;
}

export const CardRuleDisplay: React.FC<CardRuleDisplayProps> = ({ rule, theme }) => {
  const isDark = theme === Theme.Dark;

  const containerBg = isDark
    ? 'bg-zinc-900/90 border-white/10'
    : 'bg-[#1a2e1a]/90 border-green-700/40';
  const rankBox = isDark ? 'bg-zinc-800 text-white' : 'bg-[#2a5236] text-green-50';
  const titleColor = isDark ? 'text-amber-400' : 'text-amber-300';
  const descColor = isDark ? 'text-zinc-200' : 'text-green-50';
  const subColor = isDark ? 'text-zinc-400' : 'text-green-100/70';

  return (
    <div
      className={`absolute bottom-20 left-1/2 -translate-x-1/2 w-[min(92vw,460px)] z-[1500] pointer-events-none transition-all duration-500 ease-out ${
        rule ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {rule && (
        <div className={`p-5 rounded-2xl border backdrop-blur-md shadow-2xl ${containerBg}`}>
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 flex-shrink-0 flex items-center justify-center font-card font-bold text-2xl rounded shadow-md ${rankBox}`}
            >
              {rule.rank}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-base mb-1 uppercase tracking-wide ${titleColor}`}>
                {rule.title}
                {rule.titleEn && (
                  <span className={`ml-2 font-normal normal-case tracking-normal opacity-70 ${subColor}`}>
                    · {rule.titleEn}
                  </span>
                )}
              </h3>
              <p className={`text-sm leading-relaxed ${descColor}`}>{rule.desc}</p>
              {rule.descEn && (
                <p className={`text-xs italic leading-relaxed mt-1 opacity-80 ${subColor}`}>
                  {rule.descEn}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

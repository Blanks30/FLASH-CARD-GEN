import React from 'react';
import { Flashcard } from '../types';

interface FlashcardItemProps {
  card: Flashcard;
  index: number;
  isTurnedOver: boolean;
  onToggleTurnOver: () => void;
  onDelete?: (id: string) => void;
}

export const FlashcardItem: React.FC<FlashcardItemProps> = ({
  card,
  index,
  isTurnedOver,
  onToggleTurnOver,
  onDelete
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggleTurnOver();
    }
  };

  return (
    <div
      className="flashcard-container perspective-1000 w-full h-64 cursor-pointer select-none"
      onClick={onToggleTurnOver}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={isTurnedOver}
      aria-label={`Flashcard ${index + 1}: ${card.question}. ${isTurnedOver ? 'Currently turned over showing answer' : 'Click to turn over'}`}
    >
      <div
        className={`flashcard-inner relative w-full h-full duration-500 transform-style-3d transition-transform ${
          isTurnedOver ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT FACE (Question) - Light Green Background */}
        <div
          className="flashcard flashcard-front absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between border-2 border-emerald-300 shadow-md hover:shadow-lg transition-shadow backface-hidden"
          style={{ backgroundColor: '#dcfce7', color: '#064e3b' }}
        >
          {/* Card Top Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-200/90 text-emerald-900 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Card #{index + 1}
              </span>
              {card.difficulty && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  card.difficulty === 'Easy' ? 'bg-green-200 text-green-800' :
                  card.difficulty === 'Medium' ? 'bg-amber-200 text-amber-900' :
                  'bg-rose-200 text-rose-900'
                }`}>
                  {card.difficulty}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-emerald-800/80 text-xs font-medium">
              <span className="material-symbols-outlined text-sm">sync</span>
              <span>Click to turn over</span>
            </div>
          </div>

          {/* Question Body */}
          <div className="my-auto py-2">
            <div className="text-xs uppercase font-bold text-emerald-700 tracking-wider mb-2">Question</div>
            <p className="text-lg md:text-xl font-medium text-emerald-950 leading-snug">
              {card.question}
            </p>
          </div>

          {/* Card Bottom Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-emerald-200/80 text-xs text-emerald-800">
            <span className="truncate max-w-[180px] font-medium">{card.category || card.topic}</span>
            <div className="inline-flex items-center gap-1 font-semibold text-emerald-900 bg-emerald-200 hover:bg-emerald-300 px-3 py-1 rounded-full transition-colors">
              <span>Turn Over</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </div>
        </div>

        {/* BACK FACE (Answer) - Light Green Background */}
        <div
          className="flashcard flashcard-back absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between border-2 border-emerald-400 shadow-lg backface-hidden rotate-y-180"
          style={{ backgroundColor: '#dcfce7', color: '#064e3b' }}
        >
          {/* Card Top Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-300 text-emerald-950 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Answer #{index + 1}
              </span>
              <span className="bg-emerald-200/90 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-medium">
                Revealed
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-800/80 text-xs font-medium">
              <span className="material-symbols-outlined text-sm">replay</span>
              <span>Click to turn back</span>
            </div>
          </div>

          {/* Answer Body */}
          <div className="my-auto py-2 overflow-y-auto max-h-[140px] pr-1">
            <div className="text-xs uppercase font-bold text-emerald-700 tracking-wider mb-1.5">Answer</div>
            <p className="text-base md:text-lg text-emerald-950 font-normal leading-relaxed">
              {card.answer}
            </p>
          </div>

          {/* Card Bottom Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-emerald-200/80 text-xs text-emerald-800">
            <span className="font-semibold text-emerald-700">Only 1 card turned over at a time</span>
            <div className="inline-flex items-center gap-1 font-semibold text-emerald-900 bg-emerald-200 hover:bg-emerald-300 px-3 py-1 rounded-full transition-colors">
              <span className="material-symbols-outlined text-sm">flip</span>
              <span>Turn Back</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

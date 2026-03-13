
import { useState } from 'react';
import { Reading } from '../types';
import Card from './Card';
import { motion } from 'motion/react';

interface ReadingDisplayProps {
  reading: Reading;
}

export default function ReadingDisplay({ reading }: ReadingDisplayProps) {
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());

  const handleReveal = (index: number) => {
    setRevealedCards(prev => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
  };

  const allRevealed = revealedCards.size === reading.cards.length;

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full px-4 md:px-12 pb-12 md:pb-20 relative">
      {/* Lens Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-4 max-w-2xl mx-auto mb-12"
      >
        <span className="inline-block px-3 py-1 rounded-full border border-stone-700 text-stone-400 text-xs uppercase tracking-widest font-sans">
          Current Lens
        </span>
        <h2 className="text-4xl md:text-5xl font-display text-stone-100">
          {reading.lens.name}
        </h2>
        <p className="text-stone-400 text-lg font-sans font-light leading-relaxed">
          {reading.lens.definition}
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 w-full max-w-6xl flex-1 relative z-50">
        {reading.cards.map((card, index) => (
          <motion.div
            key={index}
            className="w-full md:flex-1 md:basis-0 min-w-0 max-w-[420px]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
          >
            <Card 
              card={card} 
              index={index} 
              onReveal={() => handleReveal(index)}
            />
          </motion.div>
        ))}
      </div>

      {/* Synthesis Footer */}
      {allRevealed && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-3xl mx-auto text-center pt-12 mt-12 border-t border-stone-800 w-full"
        >
          <span className="block text-xs font-sans text-stone-500 uppercase mb-4 tracking-widest">The Oracle Speaks</span>
          <p className="text-2xl md:text-3xl font-sans font-light text-stone-200 leading-snug">
            "{reading.synthesis}"
          </p>
        </motion.div>
      )}

      {/* ART AS ORACLE Footer */}
      <motion.div 
        className="mt-16 md:mt-24 pb-8 flex items-center justify-center gap-4 md:gap-6 cursor-default whitespace-nowrap group perspective-1000"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <span className="text-white font-sans text-[14px] md:text-[16px] tracking-normal">ART AS</span>
        <div className="flex">
          {"ORACLE".split('').map((letter, i) => (
            <div 
              key={i} 
              className="relative preserve-3d group-hover:[transform:rotateX(180deg)] transition-transform duration-700"
              style={{ transitionDelay: `${i * 75}ms` }}
            >
              <span className="font-extras text-[60px] md:text-[80px] text-white tracking-normal leading-none block backface-hidden">{letter}</span>
              <span className="font-display text-[60px] md:text-[80px] text-white tracking-normal leading-none absolute inset-0 backface-hidden flex items-center justify-center [transform:rotateX(180deg)]">{letter}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

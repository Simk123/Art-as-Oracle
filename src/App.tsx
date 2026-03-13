
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Reading } from './types';
import { generateReading } from './services/gemini';
import ReadingDisplay from './components/ReadingDisplay';
import Loader from './components/Loader';
import { AlertCircle, Info, X } from 'lucide-react';

type ScreenState = 'start' | 'home';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('start');
  const [reading, setReading] = useState<Reading | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleConsultOracle = async () => {
    setScreen('home');
    setLoading(true);
    setError(null);
    setReading(null);
    try {
      const data = await generateReading();
      setReading(data);
    } catch (err) {
      console.error(err);
      setError("The spirits are silent. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setScreen('start');
    setReading(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-black text-stone-200 font-sans selection:bg-stone-700 selection:text-white overflow-x-hidden">
      {/* Info Popup */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#EBE5DE] text-black w-full max-w-3xl rounded-sm p-8 md:p-12 relative overflow-y-auto max-h-full"
            >
              <button
                onClick={() => setShowInfo(false)}
                className="absolute top-6 right-6 p-1 hover:opacity-70 transition-opacity"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="flex items-center gap-2 mb-8">
                <span className="font-sans text-sm tracking-widest uppercase">ART AS</span>
                <span className="font-stitch text-4xl tracking-widest">ORACLE</span>
              </div>

              <div className="border border-black rounded-3xl p-6 md:p-8 mb-8">
                <p className="font-sans text-xl md:text-2xl leading-relaxed">
                  Most people feel disconnected from art — not because they don't care, but because ways of seeing aren't commonly taught. Art as Oracle is a tarot-inspired reading experience that bridges the artifact and the personal.
                </p>
              </div>

              <div className="space-y-6 font-sans text-base md:text-lg leading-relaxed max-w-2xl">
                <p>
                  Each session opens with a randomly assigned lens — Postcolonial, Feminist, Memory & Loss — framing how you look before you see anything. Then three cards unfold in sequence: an artwork, a thematic response to it, and a parallel work from another culture in the same historical moment. Order matters, as it does in tarot.
                </p>
                <p>
                  Each card offers context and a visual guide to help you actually look. At the end, you receive a reading — a moment that ties the art history you've encountered back to something personal.
                </p>
                <p>
                  The themes connect the works to each other. The reading connects them to you.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex flex-col ${screen === 'start' ? 'h-[100dvh] overflow-hidden' : 'min-h-screen'}`}>
        {/* Top Bar for Info Button */}
        <AnimatePresence>
          {(screen === 'start' || screen === 'home') && !loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex justify-end px-6 pt-[6px] pb-0 shrink-0 z-50"
            >
              <button
                onClick={() => setShowInfo(true)}
                className="p-2 text-[#FCE850] hover:text-[#fdf29c] transition-colors"
              >
                <Info className="w-8 h-8" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center"
            >
              <Loader />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center space-y-4 text-center px-4"
            >
              <AlertCircle className="w-12 h-12 text-red-900/50" />
              <p className="text-stone-400 font-sans max-w-md">{error}</p>
              <button
                onClick={handleConsultOracle}
                className="px-6 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-full font-sans text-xs uppercase tracking-widest transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          ) : screen === 'home' && reading ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <ReadingDisplay reading={reading} />
            </motion.div>
          ) : screen === 'start' ? (
            <motion.div
              key="start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-between text-center pt-6 pb-8 md:pt-10 md:pb-12 bg-black w-full min-h-full"
            >
              <div className="max-w-5xl space-y-2 px-4">
                <h2 className="text-[14px] font-sans font-bold text-white uppercase tracking-wider">
                  ASK THE COLLECTION A QUESTION.
                </h2>
                <p className="text-[14px] text-white font-sans max-w-4xl mx-auto leading-relaxed">
                  Draw three cards from the Met's vast archives to reveal<br className="hidden md:block" /> hidden connections through a critical lens.
                </p>
              </div>
              
              <div className="w-full flex items-center justify-center flex-1 min-h-0 py-0">
                <img src="/startimage.png" alt="Three Cards" className="w-full h-auto object-cover md:object-contain" />
              </div>

              <div className="flex flex-col items-center gap-6 md:gap-10 px-4 mb-2 md:mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConsultOracle}
                  className="w-[250px] pt-[10px] pb-[10px] pl-[25px] pr-[24px] rounded-full bg-[#FCE850] text-black font-sans font-bold text-[14px] uppercase tracking-widest hover:bg-[#fdf29c] transition-colors"
                >
                  CONSULT THE ORACLE
                </motion.button>

                <motion.div 
                  className="flex items-center justify-center gap-4 md:gap-6 cursor-default whitespace-nowrap group perspective-1000"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <span className="text-white font-sans text-[20px] md:text-[24px] tracking-normal">ART AS</span>
                  <div className="flex">
                    {"ORACLE".split('').map((letter, i) => (
                      <div 
                        key={i} 
                        className="relative preserve-3d group-hover:[transform:rotateX(180deg)] transition-transform duration-700"
                        style={{ transitionDelay: `${i * 75}ms` }}
                      >
                        <span className="font-display text-[80px] md:text-[120px] text-white tracking-normal leading-none block backface-hidden">{letter}</span>
                        <span className="font-extras text-[80px] md:text-[120px] text-white tracking-normal leading-none absolute inset-0 backface-hidden flex items-center justify-center [transform:rotateX(180deg)]">{letter}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <AnimatePresence>
        {screen === 'home' && (
          <motion.footer 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 py-4 text-center text-xs font-sans text-stone-600 border-t border-stone-900 bg-black/90 backdrop-blur-sm z-40"
          >
            <p>Powered by Gemini & The Met Open Access API</p>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  );
}

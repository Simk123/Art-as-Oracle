
import { motion } from 'motion/react';

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="w-16 h-16 border-t-2 border-b-2 border-stone-500 rounded-full"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
        className="text-stone-400 font-sans text-sm uppercase tracking-widest"
      >
        Consulting the Archives...
      </motion.p>
    </div>
  );
}

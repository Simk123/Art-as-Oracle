
import { useEffect, useState, FC } from 'react';
import { motion } from 'motion/react';
import { Card as CardType } from '../types';
import { fetchMetObject, searchMetObject, MetObject } from '../services/met';
import { Loader2, ExternalLink } from 'lucide-react';

interface CardProps {
  card: CardType;
  index: number;
  onReveal: () => void;
}

const Card: FC<CardProps> = ({ card, index, onReveal }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [metData, setMetData] = useState<MetObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadImage = async () => {
      setLoading(true);
      setError(false);
      try {
        // First try to search by title and artist to ensure we get the artwork Gemini is describing
        let data = await searchMetObject(`${card.title} ${card.artist}`);
        
        // Fallback to the provided ID if search fails
        if (!data) {
          data = await fetchMetObject(card.met_object_id);
        }

        if (mounted && data) {
          setImageUrl(data.primaryImageSmall || data.primaryImage);
          setObjectUrl(data.objectURL);
          setMetData(data);
        } else if (mounted) {
          setError(true);
        }
      } catch (e) {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadImage();
    return () => { mounted = false; };
  }, [card.met_object_id, card.title, card.artist]);

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      onReveal();
    }
  };

  const getCardBackDetails = (idx: number) => {
    switch(idx) {
      case 0:
        return { 
          title: "PROVOCATION", 
          fontClass: "font-display", 
          image: "/image_5.png",
          paddingClass: "px-[12px] pt-[12px] pb-[32px]",
          titleSizeClass: "text-[24px]",
          imgHeightClass: "h-[260px]"
        };
      case 1:
        return { 
          title: "RESISTANCE", 
          fontClass: "font-display", 
          image: "/image_3.png",
          paddingClass: "px-[12px] pt-[12px] pb-[12px]",
          titleSizeClass: "text-[23px]",
          imgHeightClass: "h-[260px]"
        };
      case 2:
        return { 
          title: "PARALLEL", 
          fontClass: "font-block", 
          image: "/image_4.png",
          paddingClass: "px-[12px] pt-[12px] pb-[12px]",
          titleSizeClass: "text-[23px]",
          imgHeightClass: "h-[260px]"
        };
      default:
        return { 
          title: "CARD", 
          fontClass: "font-display", 
          image: "/image_5.png",
          paddingClass: "p-5 md:p-8",
          titleSizeClass: "text-2xl md:text-3xl lg:text-4xl",
          imgHeightClass: "h-full"
        };
    }
  };

  const backDetails = getCardBackDetails(index);

  return (
    <div className="relative w-full aspect-[3/4] perspective-1000 group/card">
      <motion.div
        className="w-full h-full relative preserve-3d cursor-pointer"
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 200, damping: 25 }}
        onClick={handleFlip}
      >
        {/* Card Back (Pattern) */}
        <div className={`absolute inset-0 backface-hidden bg-white flex flex-col ${backDetails.paddingClass} shadow-2xl z-20 group-hover/card:-translate-y-2 transition-transform duration-300`}>
          <div className="mb-4 md:mb-6 text-left">
            <span className="block text-[10px] md:text-xs font-sans tracking-widest uppercase text-black mb-2">THE</span>
            <span className={`block ${backDetails.titleSizeClass} ${backDetails.fontClass} text-black tracking-widest uppercase leading-none`}>{backDetails.title}</span>
          </div>
          <div className="flex-1 bg-black flex items-center justify-center">
            <img src={backDetails.image} alt={`The ${backDetails.title}`} className={`w-full ${backDetails.imgHeightClass} object-contain p-6 md:p-10`} />
          </div>
          
          {/* Hover overlay hint */}
          <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/5 transition-colors duration-300 flex items-center justify-center pointer-events-none">
            <span className="opacity-0 group-hover/card:opacity-100 bg-white/90 text-black px-4 py-2 rounded-full text-xs uppercase tracking-widest font-bold transition-opacity duration-300 shadow-lg">
              Tap to Reveal
            </span>
          </div>
        </div>

        {/* Card Front (Content) */}
        <div 
          className="absolute inset-0 backface-hidden h-full w-full bg-stone-900 border border-stone-800 rounded-sm overflow-hidden shadow-xl flex flex-col"
          style={{ transform: "rotateY(180deg)" }}
        >
          {/* Header / Role */}
          <div className="p-4 border-b border-stone-800 bg-stone-950 shrink-0">
            <div className="flex justify-between items-baseline">
              <span className="font-sans text-xs text-stone-500 uppercase tracking-widest">Card {card.position}</span>
              <span className="font-display text-stone-300">{card.role}</span>
            </div>
          </div>

          {/* Image Area - Fixed height percentage to ensure text space */}
          <div className="relative h-[45%] bg-stone-950 w-full overflow-hidden group shrink-0 border-b border-stone-800">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center text-stone-600">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : error || !imageUrl ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-600 p-4 text-center">
                <span className="text-sm">Image unavailable</span>
                <span className="text-xs mt-1 opacity-50">ID: {card.met_object_id}</span>
              </div>
            ) : (
              <>
                <img
                  src={imageUrl}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {objectUrl && (
                    <a 
                        href={objectUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="View on Met Museum"
                    >
                        <ExternalLink size={16} />
                    </a>
                )}
              </>
            )}
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto scrollbar-thin overscroll-contain">
            <div className="px-6 py-6 space-y-6">
              <div>
                <h3 className="font-display text-2xl text-stone-100 leading-tight mb-2">
                  {metData?.title || card.title}
                </h3>
                <p className="text-sm text-stone-400 font-sans">
                  {metData?.artistDisplayName || card.artist}, {metData?.objectDate || card.date}
                </p>
                <p className="text-xs text-stone-500 font-sans mt-1">
                  {metData?.culture || card.culture}
                </p>
              </div>

              <div className="space-y-6 text-stone-300 text-sm md:text-base leading-relaxed pb-6 font-sans">
                <p className="text-stone-200">{card.reading}</p>
                
                <div className="pl-4 border-l-2 border-stone-700">
                  <span className="block text-[10px] font-sans text-stone-500 uppercase mb-2 tracking-widest">Visual Detail</span>
                  <p className="italic text-stone-400">{card.visual_detail}</p>
                </div>

                {card.connection_to_previous && (
                  <div className="pt-6 border-t border-stone-800 mt-auto">
                     <span className="block text-[10px] font-sans text-stone-500 uppercase mb-2 tracking-widest">Connection</span>
                     <p className="text-stone-400">{card.connection_to_previous}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Card;

import { useFloatingClock } from '@/hooks/useFloatingClock';
import { useDateFormats } from '@/hooks/useDateFormats';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';

interface TopBarProps {
  showDockedClock?: boolean;
}

export function TopBar({ showDockedClock = false }: TopBarProps) {
  const clock = useFloatingClock();
  const dateFormats = useDateFormats();
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="sticky top-0 z-50 bg-header-bar text-header-bar-foreground">
      <div className="container mx-auto px-3 sm:px-4 py-1.5 sm:py-2">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          {/* Left: Date with Hijri + Bengali Calendar */}
          <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
            <span className="font-medium truncate text-[10px] sm:text-xs md:text-sm">
              {dateFormats.loading ? clock.dateWithHijri : dateFormats.fullTopBarDate}
            </span>
          </div>

          {/* Center: Docked Clock (animated) */}
          <div className="flex-1 flex justify-center">
            <AnimatePresence>
              {showDockedClock && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="text-base sm:text-lg font-bold text-golden"
                >
                  {clock.time}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Language Toggle */}
          <div className="flex-1 flex justify-end">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
              aria-label="Toggle Language"
            >
              <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium text-[10px] sm:text-xs">
                {language === 'bn' ? 'বাংলা' : 'EN'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

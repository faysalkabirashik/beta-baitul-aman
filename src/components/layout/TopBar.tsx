import { useFloatingClock } from '@/hooks/useFloatingClock';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';

interface TopBarProps {
  showDockedClock?: boolean;
}

export function TopBar({ showDockedClock = false }: TopBarProps) {
  const clock = useFloatingClock();
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="sticky top-0 z-50 bg-header-bar text-header-bar-foreground">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          {/* Left: Date & Time */}
          <div className="flex items-center gap-2">
            <span className="font-medium">{clock.date}</span>
            <span className="opacity-70">|</span>
            <span>{clock.time}</span>
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
                  className="text-lg font-bold text-golden"
                >
                  {clock.time}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Toggle Language"
          >
            <Globe className="w-4 h-4" />
            <span className="font-medium">
              {language === 'bn' ? '🇧🇩 বাংলা' : '🇺🇸 EN'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

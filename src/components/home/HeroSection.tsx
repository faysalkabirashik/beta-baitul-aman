import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFloatingClock, useScrollPosition } from '@/hooks/useFloatingClock';
import { Button } from '@/components/ui/button';
import { BookOpen, Heart } from 'lucide-react';
import baitulAmanImage from '@/assets/baitul-aman.jpg';

export function HeroSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const clock = useFloatingClock();
  const { isScrolled } = useScrollPosition();

  return (
    <section className="relative h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={baitulAmanImage}
          alt="Baitul Aman Jamae Masjid"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col items-center justify-center text-center text-white">
        {/* Floating Clock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isScrolled ? 0 : 1, 
            y: isScrolled ? -50 : 0,
            scale: isScrolled ? 0.5 : 1 
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="clock-container mb-6"
        >
          <div className="glass-dark rounded-2xl px-8 py-4 inline-block">
            <motion.p
              key={clock.time}
              initial={{ opacity: 0.5, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-5xl md:text-6xl font-bold text-golden tracking-wider"
            >
              {clock.time}
            </motion.p>
            <p className="text-lg text-white/80 mt-1">{clock.date}</p>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg"
        >
          {t('hero.title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            size="lg"
            onClick={() => navigate('/learn-quran')}
            className="btn-golden text-white text-lg px-8 py-6"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            {t('hero.cta')}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6"
          >
            <Heart className="w-5 h-5 mr-2" />
            {t('hero.donate')}
          </Button>
        </motion.div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(43 50% 97%)"
          />
        </svg>
      </div>
    </section>
  );
}

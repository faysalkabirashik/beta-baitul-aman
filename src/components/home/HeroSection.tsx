import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFloatingClock, useScrollPosition } from '@/hooks/useFloatingClock';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { HeroInfoCarousel } from './HeroInfoCarousel';
import baitulAmanImage from '@/assets/baitul-aman.jpg';

export function HeroSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const clock = useFloatingClock();
  const { isScrolled } = useScrollPosition();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.6]);

  return (
    <section ref={sectionRef} className="relative h-[75vh] min-h-[500px] sm:min-h-[550px] max-h-[700px] overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div className="absolute inset-0" style={{ scale: bgScale }}>
        <img
          src={baitulAmanImage}
          alt="বাইতুল আমান মসজিদ"
          className="w-full h-full object-cover"
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-primary/20"
          style={{ opacity: bgOpacity }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
      </motion.div>

      {/* Floating Clock - Top Right Corner */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{
          opacity: isScrolled ? 0 : 1,
          x: isScrolled ? 50 : 0,
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="absolute top-4 right-4 z-10"
      >
        <div className="clock-container text-right">
          <motion.p
            key={clock.time}
            initial={{ opacity: 0.5, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-golden drop-shadow-lg"
          >
            {clock.time}
          </motion.p>
          <p className="text-xs sm:text-sm md:text-base text-white/90 drop-shadow-md">{clock.dateWithHijri}</p>
        </div>
      </motion.div>

      {/* Animated Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-golden/5 blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-white/5 blur-3xl animate-float-slow" style={{ animationDelay: '-2s' }} />

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col items-center justify-center text-center text-white">

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg"
        >
          বাইতুল আমান মসজিদ
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-white/90 mb-6 max-w-2xl px-2"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-6 sm:mb-8 animate-pulse-glow rounded-xl"
        >
          <Button
            size="lg"
            onClick={() => navigate('/learn-quran')}
            className="btn-golden text-white text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6"
          >
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            {t('hero.cta')}
          </Button>
        </motion.div>

        {/* Info Carousel in Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-full max-w-3xl"
        >
          <HeroInfoCarousel />
        </motion.div>
      </div>

      {/* Bottom Wave */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="absolute bottom-0 left-0 right-0"
      >
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(40 30% 96%)"
          />
        </svg>
      </motion.div>
    </section>
  );
}

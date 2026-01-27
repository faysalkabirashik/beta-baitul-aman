import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { BookOpen, MessageSquare, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface InfoSlide {
  id: string;
  titleKey: string;
  icon: React.ReactNode;
  content: {
    arabic?: string;
    bangla: string;
    reference?: string;
  };
}

const slides: InfoSlide[] = [
  {
    id: 'ayah',
    titleKey: 'carousel.ayahTitle',
    icon: <BookOpen className="w-5 h-5" />,
    content: {
      arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
      bangla: 'নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে।',
      reference: 'সূরা আশ-শারহ (৯৪:৬)',
    },
  },
  {
    id: 'khutbah',
    titleKey: 'carousel.khutbahTitle',
    icon: <MessageSquare className="w-5 h-5" />,
    content: {
      bangla: 'আগামী শুক্রবার খুতবার বিষয়: "পরিবারে ইসলামী শিক্ষার গুরুত্ব"',
      reference: 'জুমার নামাজ: দুপুর ১:১৫ মি.',
    },
  },
  {
    id: 'hadith',
    titleKey: 'carousel.hadithTitle',
    icon: <Quote className="w-5 h-5" />,
    content: {
      arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
      bangla: 'তোমাদের মধ্যে সর্বোত্তম সে, যে কুরআন শিখে এবং অন্যকে শেখায়।',
      reference: 'সহীহ বুখারী',
    },
  },
];

export function HeroInfoCarousel() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      } else {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      }
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div 
      className="relative w-full max-w-2xl mx-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Carousel Container */}
      <div className="relative h-[140px] md:h-[120px] overflow-hidden rounded-xl bg-white/10 backdrop-blur-md border border-white/20 cursor-pointer hover:bg-white/15 transition-colors">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[currentSlide].id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0 p-4 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-golden/20 flex items-center justify-center text-golden">
                {slides[currentSlide].icon}
              </div>
              <h3 className="text-sm font-semibold text-golden">
                {t(slides[currentSlide].titleKey)}
              </h3>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center">
              {slides[currentSlide].content.arabic && (
                <p className="text-lg md:text-xl font-arabic text-right text-white mb-1" dir="rtl">
                  {slides[currentSlide].content.arabic}
                </p>
              )}
              <p className="text-sm text-white/90 bengali-text line-clamp-2">
                {slides[currentSlide].content.bangla}
              </p>
              {slides[currentSlide].content.reference && (
                <p className="text-xs text-white/60 mt-1">
                  — {slides[currentSlide].content.reference}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-3">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-golden w-6'
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

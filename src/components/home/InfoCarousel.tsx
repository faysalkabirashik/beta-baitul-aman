import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, MessageSquare, Quote } from 'lucide-react';

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
    icon: <BookOpen className="w-6 h-6" />,
    content: {
      arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
      bangla: 'নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে।',
      reference: 'সূরা আশ-শারহ (৯৪:৬)',
    },
  },
  {
    id: 'khutbah',
    titleKey: 'carousel.khutbahTitle',
    icon: <MessageSquare className="w-6 h-6" />,
    content: {
      bangla: 'আগামী শুক্রবার খুতবার বিষয়: "পরিবারে ইসলামী শিক্ষার গুরুত্ব"',
      reference: 'জুমার নামাজ: দুপুর ১:১৫ মি.',
    },
  },
  {
    id: 'hadith',
    titleKey: 'carousel.hadithTitle',
    icon: <Quote className="w-6 h-6" />,
    content: {
      arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
      bangla: 'তোমাদের মধ্যে সর্বোত্তম সে, যে কুরআন শিখে এবং অন্যকে শেখায়।',
      reference: 'সহীহ বুখারী',
    },
  },
];

export function InfoCarousel() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative h-[200px] md:h-[180px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={slides[currentSlide].id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <Card className="h-full card-elevated border-primary/20 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-golden" />
                  <CardContent className="p-6 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {slides[currentSlide].icon}
                      </div>
                      <h3 className="text-lg font-semibold text-primary">
                        {t(slides[currentSlide].titleKey)}
                      </h3>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-center">
                      {slides[currentSlide].content.arabic && (
                        <p className="text-2xl md:text-3xl font-arabic text-right text-foreground mb-2" dir="rtl">
                          {slides[currentSlide].content.arabic}
                        </p>
                      )}
                      <p className="text-base md:text-lg text-foreground/90 bengali-text">
                        {slides[currentSlide].content.bangla}
                      </p>
                      {slides[currentSlide].content.reference && (
                        <p className="text-sm text-muted-foreground mt-2">
                          — {slides[currentSlide].content.reference}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-primary w-8'
                    : 'bg-primary/30 hover:bg-primary/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, toBengaliNumber } from '@/contexts/LanguageContext';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { VideoPlayer } from '@/components/lms/VideoPlayer';
import { LecturePlaylist } from '@/components/lms/LecturePlaylist';
import { QuizModal } from '@/components/lms/QuizModal';
import { BookStore } from '@/components/lms/BookStore';
import { ProgramDetails } from '@/components/lms/ProgramDetails';
import { LMSInfoCarousel } from '@/components/lms/LMSInfoCarousel';
import { Button } from '@/components/ui/button';
import { useScrollPosition } from '@/hooks/useFloatingClock';
import { ArrowRight, User, ChevronDown, ChevronUp } from 'lucide-react';
import baitulAmanNight from '@/assets/baitul-aman-night.png';

const lectures = [
  {
    id: 1,
    title: 'কুরআন ক্লাস - ৩ (১১ জানুয়ারি ২০২৬)',
    videoUrl: 'https://www.youtube.com/watch?v=Jf83GEAr2Bs',
    description: 'তাজবীদের মূল নিয়মাবলী ও মাখরাজ শিক্ষা।',
    date: '১১ জানুয়ারি ২০২৬',
    quiz: [],
  },
  {
    id: 2,
    title: 'কুরআন ক্লাস - ৪ (১২ জানুয়ারি ২০২৬)',
    videoUrl: 'https://www.youtube.com/watch?v=nFcmV_keW-Y',
    description: 'নূন সাকিন ও তানবীনের বিধান।',
    date: '১২ জানুয়ারি ২০২৬',
    quiz: [],
  },
  {
    id: 3,
    title: 'কুরআন ক্লাস - ১১ (১৯ জানুয়ারি ২০২৬)',
    videoUrl: 'https://www.youtube.com/watch?v=YpzEXiK3w5E',
    description: 'সূরা আল-ফাতিহার সঠিক তিলাওয়াত শিক্ষা।',
    date: '১৯ জানুয়ারি ২০২৬',
    quiz: [],
  },
];

export default function LearnQuran() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { isScrolled } = useScrollPosition();
  const detailsRef = useRef<HTMLDivElement>(null);
  
  const [currentLecture, setCurrentLecture] = useState(() => {
    const saved = localStorage.getItem('baitul-aman-lecture');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [showQuiz, setShowQuiz] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    localStorage.setItem('baitul-aman-lecture', String(currentLecture));
  }, [currentLecture]);

  const handleNext = () => {
    const lecture = lectures[currentLecture];
    if (lecture.quiz.length > 0) {
      setShowQuiz(true);
    } else {
      goToNextLecture();
    }
  };

  const goToNextLecture = () => {
    if (currentLecture < lectures.length - 1) {
      setCurrentLecture(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentLecture > 0) {
      setCurrentLecture(prev => prev - 1);
    }
  };

  const handleQuizComplete = () => {
    setShowQuiz(false);
    goToNextLecture();
  };

  const handleQuizSkip = () => {
    setShowQuiz(false);
    goToNextLecture();
  };

  const handleSelectLecture = (index: number) => {
    setCurrentLecture(index);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar showDockedClock={isScrolled} />
      <Header />

      {/* LMS Banner with Greenish overlay */}
      <section className="relative min-h-[350px] md:min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={baitulAmanNight}
            alt="Baitul Aman Jamae Masjid at Night"
            className="w-full h-full object-cover"
          />
          {/* Greenish gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/60 to-primary/30" />
        </div>
        
        <div className="relative h-full container mx-auto px-4 py-8 flex flex-col justify-between">
          {/* Top Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {t('lms.title')}
            </h1>
            <p className="text-lg text-white/90 mb-4">
              {t('lms.instructor')}
            </p>
            <Button
              className="btn-golden text-white"
              onClick={() => setShowDetails(!showDetails)}
            >
              {t('lms.details')}
              {showDetails ? (
                <ChevronUp className="w-4 h-4 ml-2" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-2" />
              )}
            </Button>
          </motion.div>

          {/* Info Carousel inside banner */}
          <div className="mt-6">
            <LMSInfoCarousel />
          </div>
        </div>
      </section>

      {/* Program Details (Collapsible) */}
      <AnimatePresence>
        {showDetails && (
          <ProgramDetails onClose={() => setShowDetails(false)} />
        )}
      </AnimatePresence>

      {/* Video Section with Playlist */}
      <section className="py-12" ref={detailsRef}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  {t('lms.progress')}: {language === 'bn' ? toBengaliNumber(currentLecture + 1) : currentLecture + 1}/{language === 'bn' ? toBengaliNumber(lectures.length) : lectures.length}
                </span>
                <span className="text-sm font-medium text-primary">
                  {language === 'bn' ? toBengaliNumber(Math.round(((currentLecture + 1) / lectures.length) * 100)) : Math.round(((currentLecture + 1) / lectures.length) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentLecture + 1) / lectures.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Video Player + Playlist Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Player - Takes 2/3 on desktop */}
              <div className="lg:col-span-2">
                <VideoPlayer
                  lecture={lectures[currentLecture]}
                  lectureNumber={currentLecture + 1}
                />

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentLecture === 0}
                    className={currentLecture === 0 ? 'invisible' : ''}
                  >
                    {t('lms.previous')}
                  </Button>
                  
                  <Button
                    onClick={handleNext}
                    disabled={currentLecture === lectures.length - 1}
                    className="btn-golden text-white"
                  >
                    {t('lms.next')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Playlist - Takes 1/3 on desktop, full width below on mobile */}
              <div className="lg:col-span-1">
                <LecturePlaylist
                  lectures={lectures}
                  currentLecture={currentLecture}
                  onSelectLecture={handleSelectLecture}
                />
              </div>
            </div>

            {/* Join CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 p-6 bg-gradient-to-r from-primary/10 to-golden/10 rounded-2xl border border-primary/20 text-center"
            >
              <User className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                {t('lms.joinUs')} →
              </h3>
              <p className="text-muted-foreground mb-4 bengali-text">
                লগইন করে আপনার অগ্রগতি সংরক্ষণ করুন। যেকোনো ডিভাইস থেকে শেখা চালিয়ে যান।
              </p>
              <Button
                onClick={() => navigate('/auth')}
                className="btn-golden text-white"
              >
                {t('nav.join')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Book Store */}
      <BookStore />

      {/* Quiz Modal */}
      <QuizModal
        isOpen={showQuiz}
        onClose={() => setShowQuiz(false)}
        onComplete={handleQuizComplete}
        onSkip={handleQuizSkip}
        quiz={lectures[currentLecture]?.quiz || []}
        lectureNumber={currentLecture + 1}
      />

      <Footer />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { VideoPlayer } from '@/components/lms/VideoPlayer';
import { QuizModal } from '@/components/lms/QuizModal';
import { BookStore } from '@/components/lms/BookStore';
import { ProgramDetails } from '@/components/lms/ProgramDetails';
import { Button } from '@/components/ui/button';
import { useScrollPosition } from '@/hooks/useFloatingClock';
import { ArrowRight, User, ChevronDown } from 'lucide-react';

const lectures = [
  {
    id: 1,
    title: 'তাজবীদ শিক্ষা - প্রথম পর্ব',
    videoUrl: 'https://www.youtube.com/watch?v=_sAO94AJG7U',
    description: 'তাজবীদের মূল নিয়মাবলী ও মাখরাজ শিক্ষা।',
    quiz: [
      {
        question: 'তাজবীদ শব্দের অর্থ কী?',
        options: ['সুন্দর করা', 'পড়া', 'লেখা', 'শোনা'],
        correct: 0,
      },
      {
        question: 'মাখরাজ কাকে বলে?',
        options: ['হরফের উচ্চারণ স্থান', 'থামার স্থান', 'মিলনের স্থান', 'শুরুর স্থান'],
        correct: 0,
      },
    ],
  },
  {
    id: 2,
    title: 'তাজবীদ শিক্ষা - দ্বিতীয় পর্ব',
    videoUrl: 'https://www.youtube.com/watch?v=_sAO94AJG7U',
    description: 'নূন সাকিন ও তানবীনের বিধান।',
    quiz: [
      {
        question: 'ইযহার কাকে বলে?',
        options: ['স্পষ্ট করে পড়া', 'মিলিয়ে পড়া', 'লুকিয়ে পড়া', 'টেনে পড়া'],
        correct: 0,
      },
    ],
  },
  {
    id: 3,
    title: 'সূরা আল-ফাতিহা তিলাওয়াত',
    videoUrl: 'https://www.youtube.com/watch?v=_sAO94AJG7U',
    description: 'সূরা আল-ফাতিহার সঠিক তিলাওয়াত শিক্ষা।',
    quiz: [],
  },
  {
    id: 4,
    title: 'সূরা আল-বাকারার প্রথম রুকু',
    videoUrl: 'https://www.youtube.com/watch?v=_sAO94AJG7U',
    description: 'সূরা আল-বাকারার প্রথম অংশের তিলাওয়াত।',
    quiz: [
      {
        question: 'সূরা আল-বাকারা কোন সূরা?',
        options: ['দ্বিতীয়', 'প্রথম', 'তৃতীয়', 'চতুর্থ'],
        correct: 0,
      },
    ],
  },
];

export default function LearnQuran() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isScrolled } = useScrollPosition();
  
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

  return (
    <div className="min-h-screen bg-background">
      <TopBar showDockedClock={isScrolled} />
      <Header />

      {/* LMS Banner */}
      <section className="relative h-[30vh] min-h-[200px] max-h-[300px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1920&q=80"
            alt="Night Mosque"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {t('lms.title')}
            </h1>
            <p className="text-lg text-white/80 mb-4">
              {t('lms.instructor')}
            </p>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
              onClick={() => setShowDetails(!showDetails)}
            >
              {t('lms.details')}
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Program Details (Collapsible) */}
      {showDetails && <ProgramDetails />}

      {/* Video Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  {t('lms.progress')}: {currentLecture + 1}/{lectures.length}
                </span>
                <span className="text-sm font-medium text-primary">
                  {Math.round(((currentLecture + 1) / lectures.length) * 100)}%
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

            {/* Video Player */}
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

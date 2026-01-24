import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, toBengaliNumber } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onSkip: () => void;
  quiz: QuizQuestion[];
  lectureNumber: number;
}

export function QuizModal({ isOpen, onClose, onComplete, onSkip, quiz, lectureNumber }: QuizModalProps) {
  const { t, language } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    const correct = parseInt(selectedAnswer) === quiz[currentQuestion].correct;
    setIsCorrect(correct);
    if (correct) setScore(prev => prev + 1);
    setShowResult(true);
  };

  const handleNext = () => {
    setShowResult(false);
    setSelectedAnswer('');
    
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Quiz completed
      setCurrentQuestion(0);
      setScore(0);
      onComplete();
    }
  };

  const handleSkip = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer('');
    setShowResult(false);
    onSkip();
  };

  if (quiz.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <HelpCircle className="w-5 h-5" />
            {t('lms.quiz')} - {t('lms.lecture')} {language === 'bn' ? toBengaliNumber(lectureNumber) : lectureNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                animate={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {language === 'bn' 
                ? `${toBengaliNumber(currentQuestion + 1)}/${toBengaliNumber(quiz.length)}`
                : `${currentQuestion + 1}/${quiz.length}`
              }
            </span>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-lg font-semibold mb-4 bengali-text">
                {quiz[currentQuestion].question}
              </h3>

              {!showResult ? (
                <RadioGroup
                  value={selectedAnswer}
                  onValueChange={setSelectedAnswer}
                  className="space-y-3"
                >
                  {quiz[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <RadioGroupItem value={String(index)} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-6 rounded-lg text-center ${
                    isCorrect ? 'bg-primary/10' : 'bg-destructive/10'
                  }`}
                >
                  {isCorrect ? (
                    <>
                      <CheckCircle className="w-12 h-12 text-primary mx-auto mb-2" />
                      <p className="text-lg font-semibold text-primary">সঠিক উত্তর!</p>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-12 h-12 text-destructive mx-auto mb-2" />
                      <p className="text-lg font-semibold text-destructive">ভুল উত্তর</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        সঠিক উত্তর: {quiz[currentQuestion].options[quiz[currentQuestion].correct]}
                      </p>
                    </>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button variant="ghost" onClick={handleSkip}>
            {t('lms.skip')}
          </Button>
          
          {!showResult ? (
            <Button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="btn-emerald text-white"
            >
              {t('lms.submit')}
            </Button>
          ) : (
            <Button onClick={handleNext} className="btn-golden text-white">
              {currentQuestion < quiz.length - 1 ? t('lms.next') : 'সম্পন্ন'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

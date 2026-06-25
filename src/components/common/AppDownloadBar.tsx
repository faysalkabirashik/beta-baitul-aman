import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Smartphone, X, Download, ExternalLink } from 'lucide-react';

const STORAGE_KEY = 'baitul-aman-app-bar-dismissed';

export function AppDownloadBar() {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      setIsDismissed(false);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsDismissed(true);
    }, 300);
  };

  const handleDownload = () => {
    const element = document.getElementById('app-download-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40 md:bottom-4 md:left-4 md:right-auto md:max-w-md"
        >
          <div className="relative mx-2 mb-2 md:mx-0 md:mb-0">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/90 shadow-2xl shadow-primary/30 border border-primary/20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(40,90%,50%,0.15),transparent_60%)]" />
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-golden/10 blur-xl" />

              <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center transition-colors"
                aria-label={language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              >
                <X className="w-4 h-4 text-white" />
              </button>

              <div className="relative p-4 pr-8 flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white leading-tight">
                    {language === 'bn'
                      ? 'আমাদের অ্যাপ ডাউনলোড করুন'
                      : 'Download Our App'}
                  </p>
                  <p className="text-xs text-white/80 mt-0.5">
                    {language === 'bn'
                      ? 'এখনই ডাউনলোড করুন এবং সব তথ্য হাতের মুঠোয়'
                      : 'Get all information at your fingertips'}
                  </p>
                </div>

                <button
                  onClick={handleDownload}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-golden text-white text-xs font-semibold rounded-lg hover:bg-golden/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-golden/30"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'ডাউনলোড' : 'Get App'}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

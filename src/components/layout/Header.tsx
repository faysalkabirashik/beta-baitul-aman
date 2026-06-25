import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogIn, Home, Clock, BookOpen, Grid3X3, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImage from '@/assets/logo-baitul-aman.png';

const mobileIcons: Record<string, React.ReactNode> = {
  'nav.home': <Home className="w-5 h-5" />,
  'nav.prayerTimes': <Clock className="w-5 h-5" />,
  'nav.learnQuran': <BookOpen className="w-5 h-5" />,
  'nav.services': <Grid3X3 className="w-5 h-5" />,
  'nav.about': <Info className="w-5 h-5" />,
};

export function Header() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { key: 'nav.home', href: '/', hash: '' },
    { key: 'nav.prayerTimes', href: '/', hash: 'prayer-times' },
    { key: 'nav.learnQuran', href: '/learn-quran', hash: '' },
    { key: 'nav.services', href: '/', hash: 'services' },
    { key: 'nav.about', href: '/about', hash: '' },
  ];

  const handleNavClick = (e: React.MouseEvent, href: string, hash: string) => {
    e.preventDefault();

    if (href === '/' && !hash) {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
      return;
    }

    if (href === '/learn-quran' && !hash) {
      if (location.pathname === '/learn-quran') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/learn-quran');
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
      return;
    }

    if (hash) {
      if (location.pathname === '/') {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      navigate(href);
    }
  };

  return (
    <header className="sticky top-[37px] sm:top-[44px] z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <motion.img
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              src={logoImage}
              alt="বাইতুল আমান মসজিদ"
              className="w-9 h-9 sm:w-12 sm:h-12 rounded-full object-contain"
            />
            <div className="hidden xs:block sm:hidden md:block">
              <h1 className="text-sm sm:text-lg font-bold text-foreground leading-tight">
                {t('footer.mosqueName')}
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground">House of Peace</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.hash ? `/#${item.hash}` : item.href}
                onClick={(e) => handleNavClick(e, item.href, item.hash)}
                className="px-3 lg:px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors link-underline cursor-pointer"
              >
                {t(item.key)}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => navigate('/auth')}
              className="btn-golden text-white"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {t('nav.login')}
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
              >
                <Menu className="h-5 w-5" />
              </motion.button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 sm:w-80 bg-card border-l border-border">
              <div className="flex flex-col h-full py-6">
                <AnimatePresence mode="wait">
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col h-full"
                    >
                      {/* Mobile Logo */}
                      <div className="flex items-center gap-3 mb-8 px-2">
                        <img
                          src={logoImage}
                          alt="বাইতুল আমান মসজিদ"
                          className="w-11 h-11 rounded-full object-contain"
                        />
                        <div>
                          <h2 className="text-base sm:text-lg font-bold">{t('footer.mosqueName')}</h2>
                          <p className="text-xs text-muted-foreground">House of Peace</p>
                        </div>
                      </div>

                      {/* Mobile Nav */}
                      <nav className="flex flex-col gap-1 flex-1">
                        {navItems.map((item, index) => (
                          <motion.a
                            key={item.key}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            href={item.hash ? `/#${item.hash}` : item.href}
                            onClick={(e) => {
                              handleNavClick(e, item.href, item.hash);
                              setIsOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3.5 text-base font-medium text-foreground hover:bg-primary/10 rounded-xl transition-all active:scale-[0.98]"
                          >
                            <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-primary">
                              {mobileIcons[item.key]}
                            </span>
                            {t(item.key)}
                          </motion.a>
                        ))}
                      </nav>

                      {/* Mobile CTAs */}
                      <div className="flex flex-col gap-2 pt-4 border-t border-border mt-4">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Button
                            onClick={() => {
                              navigate('/auth');
                              setIsOpen(false);
                            }}
                            className="w-full btn-golden text-white h-12 text-base"
                          >
                            <LogIn className="w-5 h-5 mr-2" />
                            {t('nav.login')}
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

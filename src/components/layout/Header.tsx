import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import logoImage from '@/assets/logo-baitul-aman.png';

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
    { key: 'nav.about', href: '/', hash: 'about' },
  ];

  const handleNavClick = (e: React.MouseEvent, href: string, hash: string) => {
    e.preventDefault();
    
    if (hash) {
      // If we're already on the home page, just scroll to the section
      if (location.pathname === '/') {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to home page first, then scroll after a short delay
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
    <header className="sticky top-[44px] z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={logoImage}
              alt="বাইতুল আমান মসজিদ"
              className="w-12 h-12 rounded-full object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground leading-tight">
                {t('footer.mosqueName')}
              </h1>
              <p className="text-xs text-muted-foreground">House of Peace</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.hash ? `/#${item.hash}` : item.href}
                onClick={(e) => handleNavClick(e, item.href, item.hash)}
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors link-underline cursor-pointer"
              >
                {t(item.key)}
              </a>
            ))}
          </nav>

          {/* CTA Button - Single Login/Join button */}
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
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-card">
              <div className="flex flex-col h-full py-6">
                {/* Mobile Logo */}
                <div className="flex items-center gap-3 mb-8">
                  <img
                    src={logoImage}
                    alt="বাইতুল আমান মসজিদ"
                    className="w-12 h-12 rounded-full object-contain"
                  />
                  <div>
                    <h2 className="text-lg font-bold">{t('footer.mosqueName')}</h2>
                    <p className="text-xs text-muted-foreground">House of Peace</p>
                  </div>
                </div>

                {/* Mobile Nav */}
                <nav className="flex flex-col gap-1 flex-1">
                  {navItems.map((item) => (
                    <a
                      key={item.key}
                      href={item.hash ? `/#${item.hash}` : item.href}
                      onClick={(e) => {
                        handleNavClick(e, item.href, item.hash);
                        setIsOpen(false);
                      }}
                      className="px-4 py-3 text-base font-medium text-foreground hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                    >
                      {t(item.key)}
                    </a>
                  ))}
                </nav>

                {/* Mobile CTAs */}
                <div className="flex flex-col gap-2 pt-4 border-t border-border">
                  <Button
                    onClick={() => {
                      navigate('/auth');
                      setIsOpen(false);
                    }}
                    className="w-full btn-golden text-white"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    {t('nav.login')}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Phone, Clock, Mail, ExternalLink, Smartphone, ChevronRight } from 'lucide-react';
import logoImage from '@/assets/logo-baitul-aman.png';

export function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-sidebar text-sidebar-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(40,90%,50%,0.05),transparent_60%)]" />
      <div className="container mx-auto px-4 py-10 sm:py-12 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Mosque Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <img
                src={logoImage}
                alt="বাইতুল আমান মসজিদ"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-contain"
              />
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {t('footer.mosqueName')}
                </h3>
                <p className="text-xs text-sidebar-foreground/70">House of Peace</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-sidebar-foreground/80 bengali-text">
              {language === 'bn' ? 'ঢাকার ধানমন্ডিতে অবস্থিত একটি ঐতিহ্যবাহী মসজিদ। সকল মুসল্লিদের জন্য উন্মুক্ত।' : 'A historic mosque in Dhanmondi, Dhaka. Open to all worshippers.'}
            </p>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="text-base sm:text-lg font-semibold text-golden">{language === 'bn' ? 'যোগাযোগ' : 'Contact'}</h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-3 group">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-golden mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-white transition-colors">{t('footer.address')}</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-golden flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-white transition-colors">০১৫৫২-৬৩২৪৫১</span>
              </li>
              <li className="flex items-start gap-3 group">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-golden mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium">{t('footer.officeHours')}</p>
                  <p className="text-sidebar-foreground/70">{t('footer.officeTime')}</p>
                </div>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-golden flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-white transition-colors">info@baitulaman.org</span>
              </li>
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-base sm:text-lg font-semibold text-golden">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {[
                { to: '/', label: t('nav.home') },
                { to: '/#prayer-times', label: t('nav.prayerTimes') },
                { to: '/learn-quran', label: t('nav.learnQuran') },
                  { to: '/#events', label: language === 'bn' ? 'অনুষ্ঠান' : 'Events' },
                { to: '/auth', label: t('nav.join') },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className="inline-flex items-center gap-1 hover:text-golden transition-all hover:translate-x-1 group"
                  >
                    <ChevronRight className="w-3 h-3 text-golden/50 group-hover:text-golden transition-colors" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* App Download & Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            id="app-download-section"
            className="space-y-4"
          >
            <h4 className="text-base sm:text-lg font-semibold text-golden flex items-center gap-2">
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
              {t('footer.downloadApp')}
            </h4>
            <div className="flex flex-col gap-2 sm:gap-3">
              <a
                href="#"
                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-sidebar-accent rounded-xl hover:bg-sidebar-accent/80 transition-all hover:scale-[1.02] active:scale-[0.98] group"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.523 0H6.477A2.477 2.477 0 0 0 4 2.477v19.046A2.477 2.477 0 0 0 6.477 24h11.046A2.477 2.477 0 0 0 20 21.523V2.477A2.477 2.477 0 0 0 17.523 0zM12 22.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5-4.5H7V3h10v15z"/>
                </svg>
                <span className="text-xs sm:text-sm flex-1">Google Play</span>
                <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="#"
                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-sidebar-accent rounded-xl hover:bg-sidebar-accent/80 transition-all hover:scale-[1.02] active:scale-[0.98] group"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span className="text-xs sm:text-sm flex-1">App Store</span>
                <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>

            {/* Mini Map */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="rounded-xl overflow-hidden border border-sidebar-border"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.9024799999998!2d90.3788!3d23.7442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ0JzM5LjEiTiA5MMKwMjInNDMuNyJF!5e0!3m2!1sen!2sbd!4v1234567890"
                width="100%"
                height="100"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Baitul Aman Location"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-sidebar-border">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <p className="text-center text-xs sm:text-sm text-sidebar-foreground/60">
            © {new Date().getFullYear()} {t('footer.mosqueName')} | {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}

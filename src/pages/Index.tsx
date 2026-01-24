import { useScrollPosition } from '@/hooks/useFloatingClock';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { PrayerTimesSection } from '@/components/home/PrayerTimesSection';
import { NoticeBoard } from '@/components/home/NoticeBoard';
import { ServicesSection } from '@/components/home/ServicesSection';
import { AboutSection } from '@/components/home/AboutSection';
import { Footer } from '@/components/layout/Footer';
import { RamadanCalendarFAB } from '@/components/ramadan/RamadanCalendarFAB';

const Index = () => {
  const { isScrolled } = useScrollPosition();

  return (
    <div className="min-h-screen bg-background">
      <TopBar showDockedClock={isScrolled} />
      <Header />
      <main>
        <HeroSection />
        <PrayerTimesSection />
        <NoticeBoard />
        <ServicesSection />
        <AboutSection />
      </main>
      <Footer />
      <RamadanCalendarFAB />
    </div>
  );
};

export default Index;

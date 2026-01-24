import { useScrollPosition } from '@/hooks/useFloatingClock';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { InfoCarousel } from '@/components/home/InfoCarousel';
import { PrayerTimesSection } from '@/components/home/PrayerTimesSection';
import { NoticeBoard } from '@/components/home/NoticeBoard';
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
        <InfoCarousel />
        <PrayerTimesSection />
        <NoticeBoard />
      </main>
      <Footer />
      <RamadanCalendarFAB />
    </div>
  );
};

export default Index;

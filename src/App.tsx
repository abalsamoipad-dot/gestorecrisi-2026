import { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Expertise from '@/components/sections/Expertise';
import Stats from '@/components/sections/Stats';
import FAQ from '@/components/sections/FAQ';
import Team from '@/components/sections/Team';
import News from '@/components/sections/News';
import Contact from '@/components/sections/Contact';
import AreaRiservata from '@/components/sections/AreaRiservata';

export default function App() {
  const [showVip, setShowVip] = useState(false);

  const handleOpenVip = useCallback(() => setShowVip(true), []);
  const handleCloseVip = useCallback(() => setShowVip(false), []);

  return (
    <>
      <Header onOpenVip={handleOpenVip} />
      <main>
        <Hero />
        <Expertise />
        <Stats />
        <FAQ />
        <Team />
        <News />
        <Contact />
      </main>
      <Footer />
      <AreaRiservata isOpen={showVip} onClose={handleCloseVip} />
    </>
  );
}

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Expertise from '@/components/sections/Expertise';
import Stats from '@/components/sections/Stats';
import FAQ from '@/components/sections/FAQ';
import Team from '@/components/sections/Team';
import News from '@/components/sections/News';
import Contact from '@/components/sections/Contact';

export default function App() {
  return (
    <>
      <Header />
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
    </>
  );
}

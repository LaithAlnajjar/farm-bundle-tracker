import { Navbar } from '@/components/sections/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { BundleBoard } from '@/components/sections/BundleBoard';
import { SoloVsCoop } from '@/components/sections/SoloVsCoop';
import { CallToAction } from '@/components/sections/CallToAction';
import { Footer } from '@/components/sections/Footer';

/** The full Valley Bundles landing page. */
export function HomePage() {
  return (
    <div id="top" className="dot-grid min-h-screen text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <BundleBoard />
        <SoloVsCoop />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

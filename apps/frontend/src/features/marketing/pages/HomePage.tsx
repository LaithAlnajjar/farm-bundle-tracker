import { BundleBoard } from '@/features/marketing/components/BundleBoard';
import { CallToAction } from '@/features/marketing/components/CallToAction';
import { Features } from '@/features/marketing/components/Features';
import { Footer } from '@/features/marketing/components/Footer';
import { Hero } from '@/features/marketing/components/Hero';
import { Navbar } from '@/features/marketing/components/Navbar';

/** The full Valley Bundles landing page. */
export function HomePage() {
  return (
    <div id="top" className="dot-grid min-h-screen text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <BundleBoard />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

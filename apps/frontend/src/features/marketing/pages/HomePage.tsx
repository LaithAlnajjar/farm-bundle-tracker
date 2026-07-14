import { BundleBoard } from '@/features/marketing/components/BundleBoard';
import { CallToAction } from '@/features/marketing/components/CallToAction';
import { Features } from '@/features/marketing/components/Features';
import { Footer } from '@/features/marketing/components/Footer';
import { Hero } from '@/features/marketing/components/Hero';
import { HowItWorks } from '@/features/marketing/components/HowItWorks';
import { Navbar } from '@/features/marketing/components/Navbar';
import { Quote } from '@/features/marketing/components/Quote';
import { Seasons } from '@/features/marketing/components/Seasons';
import { TrustStrip } from '@/features/marketing/components/TrustStrip';

/** Marketing landing page — the notice board, top to bottom. */
export function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <Features />
        <BundleBoard />
        <Seasons />
        <Quote />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

import { Navigation } from '@/components/navigation';
import { HeroSection } from '@/components/hero-section';
import { MetricsGrid } from '@/components/metrics-grid';
import { ThreeVisualization } from '@/components/three-visualization';
import { CorePrinciples } from '@/components/core-principles';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%270%200%20200%20200%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter%20id=%27noiseFilter%27%3E%3CfeTurbulence%20type=%27fractalNoise%27%20baseFrequency=%270.65%27%20numOctaves=%273%27%20stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect%20width=%27100%25%27%20height=%27100%25%27%20filter=%27url(%23noiseFilter)%27/%3E%3C/svg%3E')]" />

      <Navigation />

      <main>
        <section className="relative min-h-screen pt-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <ThreeVisualization />
          </div>

          <div className="relative z-10 min-h-screen flex flex-col">
            <div className="flex-grow flex items-center">
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-12 sm:py-16 md:py-20">
                <HeroSection />
              </div>
            </div>

            <div className="border-t border-grid-line bg-white/95 backdrop-blur-sm">
              <div className="max-w-7xl mx-auto">
                <MetricsGrid />
              </div>
            </div>
          </div>
        </section>

        <CorePrinciples />
      </main>

      <Footer />
    </>
  );
}

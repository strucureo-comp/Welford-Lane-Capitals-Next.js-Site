import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { ThreeVisualization } from '@/components/three-visualization';

const insights = [
  {
    date: 'Dec 2024',
    category: 'Market Commentary',
    title: 'Central Bank Divergence and FX Volatility',
    excerpt: 'Analyzing the impact of diverging monetary policies between the Fed and ECB on currency pair volatility structures and systematic trading opportunities.',
    readTime: '8 min'
  },
  {
    date: 'Nov 2024',
    category: 'Research',
    title: 'Machine Learning in Liquidity Detection',
    excerpt: 'Our latest research on applying gradient boosting models to identify hidden liquidity pools in electronic FX markets during low-volume sessions.',
    readTime: '12 min'
  },
  {
    date: 'Oct 2024',
    category: 'Risk Management',
    title: 'Adaptive Position Sizing During Regime Changes',
    excerpt: 'Framework for dynamically adjusting position sizes based on detected market regime transitions using hidden Markov models.',
    readTime: '10 min'
  },
  {
    date: 'Sep 2024',
    category: 'Market Structure',
    title: 'The Evolution of Index Arbitrage',
    excerpt: 'How changes in equity index composition and futures market microstructure have reshaped systematic arbitrage strategies.',
    readTime: '9 min'
  }
];

export default function InsightsPage() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%270%200%20200%20200%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter%20id=%27noiseFilter%27%3E%3CfeTurbulence%20type=%27fractalNoise%27%20baseFrequency=%270.65%27%20numOctaves=%273%27%20stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect%20width=%27100%25%27%20height=%27100%25%27%20filter=%27url(%23noiseFilter)%27/%3E%3C/svg%3E')]" />

      <Navigation />

      <main>
        <section className="relative min-h-[60vh] pt-16 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-40">
            <ThreeVisualization />
          </div>

          <div className="relative z-10 min-h-[60vh] flex items-center">
            <div className="w-full max-w-7xl mx-auto px-8 md:px-16 py-20">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-grid-line shadow-2xl max-w-3xl">
                <div className="mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-signal-blue rounded-full animate-pulse"></div>
                  <span className="text-xs font-mono uppercase text-gray-400 tracking-widest">
                    Research & Analysis
                  </span>
                </div>

                <h1 className="font-display text-5xl md:text-6xl font-semibold leading-[0.95] tracking-tighter mb-6 text-carbon">
                  Market Intelligence & Research
                </h1>

                <p className="font-sans text-lg text-gray-600 leading-relaxed">
                  Proprietary research, market commentary, and technical insights from our quantitative research team.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border-t border-grid-line py-16">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            <div className="mb-12">
              <h2 className="font-display text-3xl font-bold mb-4">Latest Insights</h2>
              <p className="text-gray-600">Deep dives into systematic trading, market structure, and quantitative research.</p>
            </div>

            <div className="space-y-6">
              {insights.map((insight, index) => (
                <article
                  key={index}
                  className="border border-grid-line rounded-lg p-8 hover:border-signal-blue transition-all hover:shadow-lg group cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="flex items-center gap-4 mb-2 md:mb-0">
                      <span className="text-xs font-mono text-gray-400">{insight.date}</span>
                      <span className="text-xs font-mono text-signal-blue uppercase tracking-wider">
                        {insight.category}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-gray-400">{insight.readTime} read</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3 text-carbon group-hover:text-signal-blue transition-colors">
                    {insight.title}
                  </h3>
                  <p className="font-sans text-gray-600 leading-relaxed mb-4">
                    {insight.excerpt}
                  </p>
                  <button className="text-sm font-medium text-signal-blue flex items-center gap-2 group-hover:gap-3 transition-all">
                    Read Full Report <span>→</span>
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-carbon text-white py-16 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display text-3xl font-bold mb-6">Proprietary Research</h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Our research team publishes quarterly white papers on quantitative finance, market microstructure, and systematic trading methodologies.
                </p>
                <p className="text-gray-400 leading-relaxed mb-8">
                  Institutional investors gain exclusive access to our full research library, backtesting frameworks, and live strategy monitoring dashboards.
                </p>
                <button className="border border-white px-8 py-4 font-display font-medium text-sm hover:bg-white hover:text-carbon transition-all">
                  Request Research Access
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <div className="text-4xl font-display font-bold mb-2">127</div>
                  <div className="text-sm text-gray-400">Published Papers</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <div className="text-4xl font-display font-bold mb-2">43</div>
                  <div className="text-sm text-gray-400">Trading Signals</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <div className="text-4xl font-display font-bold mb-2">18</div>
                  <div className="text-sm text-gray-400">Asset Classes</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <div className="text-4xl font-display font-bold mb-2">24/7</div>
                  <div className="text-sm text-gray-400">Market Coverage</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-off-white border-t border-grid-line py-16">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl font-bold mb-6">Subscribe to Market Updates</h2>
              <p className="text-gray-600 mb-8">
                Receive weekly market commentary and quarterly research reports directly to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <input
                  type="email"
                  placeholder="your.email@firm.com"
                  className="flex-grow px-6 py-4 border border-grid-line rounded-lg focus:outline-none focus:border-signal-blue transition-colors"
                />
                <button className="bg-carbon text-white px-8 py-4 rounded-lg font-display font-medium hover:bg-signal-blue transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

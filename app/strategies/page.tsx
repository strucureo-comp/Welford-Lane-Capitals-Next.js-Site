import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { ThreeVisualization } from '@/components/three-visualization';

const strategies = [
  {
    name: 'Systematic Macro',
    description: 'Quantitative models analyzing global macroeconomic indicators, central bank policies, and geopolitical events to identify structural market trends.',
    metrics: { sharpe: '2.4', maxDrawdown: '-8.2%', allocation: '45%' }
  },
  {
    name: 'Volatility Arbitrage',
    description: 'Statistical analysis of implied vs. realized volatility across asset classes, capturing mispricing in options markets through delta-neutral positioning.',
    metrics: { sharpe: '1.9', maxDrawdown: '-6.5%', allocation: '30%' }
  },
  {
    name: 'Currency Momentum',
    description: 'Multi-timeframe trend following in G10 currency pairs, utilizing order flow analysis and liquidity modeling for optimal entry and exit timing.',
    metrics: { sharpe: '2.1', maxDrawdown: '-9.1%', allocation: '25%' }
  }
];

export default function StrategiesPage() {
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
                    Investment Strategies
                  </span>
                </div>

                <h1 className="font-display text-5xl md:text-6xl font-semibold leading-[0.95] tracking-tighter mb-6 text-carbon">
                  Systematic Approach to Alpha Generation
                </h1>

                <p className="font-sans text-lg text-gray-600 leading-relaxed">
                  Our strategies combine quantitative rigor with adaptive execution, deployed across diversified global markets to deliver consistent risk-adjusted returns.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border-t border-grid-line">
          <div className="max-w-7xl mx-auto px-8 md:px-16 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {strategies.map((strategy, index) => (
                <div
                  key={index}
                  className="border border-grid-line rounded-lg p-8 hover:border-signal-blue transition-all hover:shadow-lg group"
                >
                  <div className="text-gray-300 font-display text-4xl font-bold mb-4 group-hover:text-signal-blue transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-4 text-carbon">
                    {strategy.name}
                  </h3>
                  <p className="font-sans text-sm text-gray-600 leading-relaxed mb-6">
                    {strategy.description}
                  </p>
                  <div className="border-t border-grid-line pt-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono text-gray-400">SHARPE RATIO</span>
                      <span className="font-display text-lg font-bold">{strategy.metrics.sharpe}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono text-gray-400">MAX DRAWDOWN</span>
                      <span className="font-display text-lg font-bold">{strategy.metrics.maxDrawdown}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono text-gray-400">ALLOCATION</span>
                      <span className="font-display text-lg font-bold text-signal-blue">{strategy.metrics.allocation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-carbon text-white py-16 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="font-display text-3xl font-bold mb-6">Risk Management Framework</h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Every strategy operates within strict risk parameters: position-level stop losses, portfolio-level VaR limits, and dynamic exposure scaling based on realized volatility.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Our proprietary risk engine monitors thousands of data points in real-time, ensuring capital preservation remains the primary directive.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
                <div className="text-xs font-mono text-gray-400 mb-4">PORTFOLIO CONSTRAINTS</div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Max Position Size</span>
                      <span className="font-display font-bold">5%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-signal-blue w-[5%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Max Strategy Allocation</span>
                      <span className="font-display font-bold">45%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-signal-blue w-[45%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Portfolio VaR (95%)</span>
                      <span className="font-display font-bold">2.5%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-signal-blue w-[25%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

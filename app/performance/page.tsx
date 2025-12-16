import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { ThreeVisualization } from '@/components/three-visualization';

const monthlyReturns = [
  { month: 'Jan', return: 2.3 },
  { month: 'Feb', return: 1.8 },
  { month: 'Mar', return: 3.1 },
  { month: 'Apr', return: -0.5 },
  { month: 'May', return: 2.7 },
  { month: 'Jun', return: 1.9 },
  { month: 'Jul', return: 3.4 },
  { month: 'Aug', return: 2.1 },
  { month: 'Sep', return: -1.2 },
  { month: 'Oct', return: 2.8 },
  { month: 'Nov', return: 3.2 },
  { month: 'Dec', return: 2.5 }
];

export default function PerformancePage() {
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
                    Track Record
                  </span>
                </div>

                <h1 className="font-display text-5xl md:text-6xl font-semibold leading-[0.95] tracking-tighter mb-6 text-carbon">
                  Audited Performance Metrics
                </h1>

                <p className="font-sans text-lg text-gray-600 leading-relaxed">
                  Transparent reporting of risk-adjusted returns, independently verified by third-party administrators and auditors.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border-t border-grid-line py-16">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              <div className="border border-grid-line rounded-lg p-6 hover:border-signal-blue transition-all">
                <div className="text-xs font-mono text-gray-400 mb-2">YTD RETURN</div>
                <div className="font-display text-4xl font-bold text-carbon mb-1">24.1%</div>
                <div className="text-xs text-green-600 font-mono">▲ Net of Fees</div>
              </div>
              <div className="border border-grid-line rounded-lg p-6 hover:border-signal-blue transition-all">
                <div className="text-xs font-mono text-gray-400 mb-2">SHARPE RATIO</div>
                <div className="font-display text-4xl font-bold text-carbon mb-1">2.2</div>
                <div className="text-xs text-gray-400 font-mono">Risk-Adjusted</div>
              </div>
              <div className="border border-grid-line rounded-lg p-6 hover:border-signal-blue transition-all">
                <div className="text-xs font-mono text-gray-400 mb-2">MAX DRAWDOWN</div>
                <div className="font-display text-4xl font-bold text-carbon mb-1">-9.8%</div>
                <div className="text-xs text-gray-400 font-mono">Since Inception</div>
              </div>
              <div className="border border-grid-line rounded-lg p-6 hover:border-signal-blue transition-all">
                <div className="text-xs font-mono text-gray-400 mb-2">WIN RATE</div>
                <div className="font-display text-4xl font-bold text-carbon mb-1">68%</div>
                <div className="text-xs text-gray-400 font-mono">Positive Months</div>
              </div>
            </div>

            <div className="border border-grid-line rounded-lg p-8">
              <h2 className="font-display text-2xl font-bold mb-8">2024 Monthly Returns</h2>
              <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-4">
                {monthlyReturns.map((data) => (
                  <div
                    key={data.month}
                    className="text-center"
                  >
                    <div className="text-xs font-mono text-gray-400 mb-2">{data.month}</div>
                    <div
                      className={`font-display text-lg font-bold ${
                        data.return >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {data.return >= 0 ? '+' : ''}{data.return}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-off-white border-t border-grid-line py-16">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="font-display text-3xl font-bold mb-6">Historical Performance</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-grid-line pb-4">
                    <span className="font-mono text-sm text-gray-500">2023</span>
                    <span className="font-display text-xl font-bold text-green-600">+28.4%</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-grid-line pb-4">
                    <span className="font-mono text-sm text-gray-500">2022</span>
                    <span className="font-display text-xl font-bold text-green-600">+19.7%</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-grid-line pb-4">
                    <span className="font-mono text-sm text-gray-500">2021</span>
                    <span className="font-display text-xl font-bold text-green-600">+31.2%</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-grid-line pb-4">
                    <span className="font-mono text-sm text-gray-500">2020</span>
                    <span className="font-display text-xl font-bold text-green-600">+22.8%</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-8 border border-grid-line">
                <h3 className="font-display text-xl font-bold mb-6">Risk Metrics</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Volatility (Annualized)</span>
                      <span className="font-display font-bold">11.2%</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Sortino Ratio</span>
                      <span className="font-display font-bold">3.1</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Calmar Ratio</span>
                      <span className="font-display font-bold">2.5</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Beta to S&P 500</span>
                      <span className="font-display font-bold">0.12</span>
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

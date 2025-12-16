export function MetricsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <div className="p-4 sm:p-6 md:p-8 border-b sm:border-r border-grid-line hover:bg-off-white transition-colors">
        <div className="text-xs font-mono text-gray-400 mb-2">AUM</div>
        <div className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-carbon">$2.8B</div>
        <div className="text-xs text-green-600 mt-2 font-mono">▲ 12.50% YoY</div>
      </div>
      <div className="p-4 sm:p-6 md:p-8 border-b lg:border-r border-grid-line hover:bg-off-white transition-colors">
        <div className="text-xs font-mono text-gray-400 mb-2">CAGR (5YR)</div>
        <div className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-carbon">24.7%</div>
        <div className="text-xs text-gray-400 mt-2 font-mono">Compound Annual</div>
      </div>
      <div className="p-4 sm:p-6 md:p-8 flex items-center justify-between hover:bg-off-white transition-colors cursor-pointer group sm:col-span-2 lg:col-span-1">
        <div>
          <div className="text-xs font-mono text-gray-400 mb-1">GOVERNANCE</div>
          <div className="font-display text-base sm:text-lg font-medium">Viyas, Kowshik & Aathish</div>
        </div>
        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-carbon transition-colors flex-shrink-0 ml-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

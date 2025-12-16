import Link from 'next/link';

export function HeroSection() {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 border border-grid-line shadow-2xl max-w-2xl w-full">
      <div className="mb-4 sm:mb-6 flex items-center gap-2">
        <div className="w-2 h-2 bg-signal-blue rounded-full animate-pulse"></div>
        <span className="text-[10px] sm:text-xs font-mono uppercase text-gray-400 tracking-widest">
          Systematic Global Macro
        </span>
      </div>

      <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-semibold leading-[0.9] tracking-tighter mb-6 sm:mb-8 text-carbon">
        Decoding <br />
        Market <br />
        <span className="text-gray-300">Structure.</span>
      </h1>

      <p className="font-sans text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-10">
        Welford Lane Capitals is an elite alternative investment firm. We preserve capital and generate consistent alpha through rigorous, data-driven execution in global FX and index markets.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Link href="/strategies" className="border border-carbon px-6 sm:px-8 py-3 sm:py-4 font-display font-medium text-xs sm:text-sm hover:bg-carbon hover:text-white transition-all text-center">
          Explore Methodology
        </Link>
        <button className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 font-display font-medium text-xs sm:text-sm text-gray-500 hover:text-signal-blue transition-colors">
          View 2024 Report <span className="text-base sm:text-lg">→</span>
        </button>
      </div>
    </div>
  );
}

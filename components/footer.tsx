export function Footer() {
  return (
    <footer className="bg-carbon text-white py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 sm:mb-12">
          <div>
            <div className="font-display font-bold text-xl sm:text-2xl tracking-tight mb-2">
              Welford Lane Capitals
            </div>
            <div className="text-gray-500 text-xs sm:text-sm">Elite Alternative Investment Strategies</div>
          </div>
          <div className="mt-6 md:mt-0 flex gap-6 sm:gap-8">
            <a href="#" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
              Twitter
            </a>
            <a href="#" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between text-[10px] sm:text-xs text-gray-500 font-mono">
          <p>&copy; 2025 Welford Lane Capitals. All rights reserved.</p>
          <div className="flex gap-3 sm:gap-4 mt-3 md:mt-0">
            <p>Established 2010</p>
            <p>New York • London</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

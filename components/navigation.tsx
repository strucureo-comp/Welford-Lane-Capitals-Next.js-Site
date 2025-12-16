'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-40 bg-white/90 backdrop-blur-sm border-b border-grid-line">
      <div className="flex h-16">
        <Link href="/" className="w-32 sm:w-48 md:w-64 flex-shrink-0 flex items-center px-4 sm:px-6 md:px-8 border-r border-grid-line bg-white">
          <div className="font-display font-bold text-lg sm:text-xl tracking-tighter">
            WLC<span className="text-signal-blue">.</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-grow justify-end items-center px-4 md:px-8 space-x-4 md:space-x-8 text-sm font-medium tracking-wide">
          <Link href="/strategies" className="hover:text-signal-blue transition-colors">Strategies</Link>
          <Link href="/performance" className="hover:text-signal-blue transition-colors">Performance</Link>
          <Link href="/insights" className="hover:text-signal-blue transition-colors">Insights</Link>
        </div>

        {/* Desktop Login Button */}
        <Link
          href="/login"
          className="hidden lg:flex items-center justify-center w-32 sm:w-40 md:w-48 bg-carbon text-white text-xs sm:text-sm font-medium hover:bg-signal-blue transition-colors duration-300"
        >
          Login
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden flex-grow flex items-center justify-end px-4 text-carbon"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-grid-line">
          <div className="flex flex-col space-y-1 py-4">
            <Link 
              href="/strategies" 
              className="px-6 py-3 text-sm font-medium hover:bg-off-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Strategies
            </Link>
            <Link 
              href="/performance" 
              className="px-6 py-3 text-sm font-medium hover:bg-off-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Performance
            </Link>
            <Link 
              href="/insights" 
              className="px-6 py-3 text-sm font-medium hover:bg-off-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Insights
            </Link>
            <Link 
              href="/login" 
              className="mx-6 mt-2 py-3 text-center bg-carbon text-white text-sm font-medium hover:bg-signal-blue transition-colors rounded"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

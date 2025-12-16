'use client';

import { useState, useTransition } from 'react';
import { loginAction } from './actions';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import Link from 'next/link';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) {
        setError(result.error);
      }
      // If successful, redirect() in the action will handle navigation
    });
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%270%200%20200%20200%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter%20id=%27noiseFilter%27%3E%3CfeTurbulence%20type=%27fractalNoise%27%20baseFrequency=%270.65%27%20numOctaves=%273%27%20stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect%20width=%27100%25%27%20height=%27100%25%27%20filter=%27url(%23noiseFilter)%27/%3E%3C/svg%3E')]" />

      <Navigation />

      <main className="min-h-screen pt-16 flex items-center justify-center bg-off-white">
        <div className="w-full max-w-md px-8 py-12">
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-grid-line shadow-2xl">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-signal-blue rounded-full animate-pulse"></div>
                <span className="text-xs font-mono uppercase text-gray-400 tracking-widest">
                  Secure Access
                </span>
              </div>
              <h1 className="font-display text-4xl font-bold text-carbon mb-2">
                Investor Login
              </h1>
              <p className="text-gray-600">Access your portfolio and performance data</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-grid-line rounded-lg focus:outline-none focus:border-signal-blue transition-colors"
                  placeholder="investor@firm.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-grid-line rounded-lg focus:outline-none focus:border-signal-blue transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-carbon text-white py-4 rounded-lg font-display font-medium hover:bg-signal-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-signal-blue hover:underline font-medium">
                  Request Access
                </Link>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-grid-line">
              <p className="text-xs text-gray-500 text-center">
                Protected by enterprise-grade encryption. <br />
                For access inquiries, contact{' '}
                <a href="mailto:access@welfordlane.com" className="text-signal-blue hover:underline">
                  access@welfordlane.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

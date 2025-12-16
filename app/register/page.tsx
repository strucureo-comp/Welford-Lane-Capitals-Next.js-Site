'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    phone: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(true);
    } catch (error: any) {
      alert(error.message || 'Failed to submit registration');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg border border-grid-line p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-carbon mb-4">Registration Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in Welford Lane Capitals. Your registration has been submitted for review.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-carbon mb-2">What happens next?</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-signal-blue mr-2">1.</span>
                  <span>Our team will review your application</span>
                </li>
                <li className="flex items-start">
                  <span className="text-signal-blue mr-2">2.</span>
                  <span>If approved, you'll receive an email with your login credentials</span>
                </li>
                <li className="flex items-start">
                  <span className="text-signal-blue mr-2">3.</span>
                  <span>Use those credentials to access your investor portal</span>
                </li>
              </ul>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              This process typically takes 1-2 business days.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Return to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg border border-grid-line p-8">
          <div className="text-center mb-8">
            <div className="font-display font-bold text-2xl tracking-tighter mb-2">
              WLC<span className="text-signal-blue">.</span>
            </div>
            <h1 className="text-2xl font-bold text-carbon mb-2">Request Access</h1>
            <p className="text-gray-600 text-sm">
              Submit your information to request investor portal access
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john.doe@example.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="company">Company / Organization</Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Acme Corporation"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="mt-1"
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <p className="font-semibold text-carbon mb-2">Please note:</p>
              <ul className="space-y-1 text-xs">
                <li>• Your request will be reviewed by our team</li>
                <li>• You will receive login credentials via email if approved</li>
                <li>• This process typically takes 1-2 business days</li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-carbon text-white hover:bg-signal-blue"
            >
              {loading ? 'Submitting...' : 'Submit Registration'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link href="/login" className="text-signal-blue hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          By registering, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}


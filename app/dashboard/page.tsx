'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentProfile, signOut } from '@/lib/auth';
import type { Profile } from '@/lib/supabase';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getCurrentProfile();
        if (!data) {
          router.push('/login');
          return;
        }
        setProfile(data);

        if (data.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/investor');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-signal-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
}

// src/types/index.ts
export interface Profile {
  id: string;
  email: string;
  phone?: string;
  full_name?: string;
  avatar_url?: string;
  date_of_birth?: string;
  zodiac_sign?: string;
  region?: string;
  language?: string;
  is_premium: boolean;
  premium_expiry?: string;
  notify_festival: boolean;
  notify_daily: boolean;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export type OnboardingData = Omit<Profile,
  'id' | 'email' | 'is_premium' | 'premium_expiry' | 'created_at' | 'updated_at'
>;
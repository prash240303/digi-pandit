// src/context/onboarding-context.tsx
import React, { createContext, useContext, useState } from 'react';
import { OnboardingData } from '../types';

interface OnboardingContextType {
  data: Partial<OnboardingData>;
  setData: (d: Partial<OnboardingData>) => void;
}

const OnboardingContext = createContext<OnboardingContextType>({} as OnboardingContextType);

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setDataState] = useState<Partial<OnboardingData>>({});
  const setData = (d: Partial<OnboardingData>) =>
    setDataState(prev => ({ ...prev, ...d }));

  return (
    <OnboardingContext.Provider value={{ data, setData }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);
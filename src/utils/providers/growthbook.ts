import { useEffect } from 'react';
import { GrowthBook } from '@growthbook/growthbook-react';
import env from '@/src/constants/env';

const gb = new GrowthBook({
  apiHost: 'https://cdn.growthbook.io',
  clientKey: env.GROWTHBOOK_KEY,
  // Enable easier debugging during development
  enableDevMode: true,
});

export const useSetupGrowthBook = () => {
  useEffect(() => {
    gb.loadFeatures({ autoRefresh: true });
  }, []);
  if (!env.GROWTHBOOK_KEY) {
    console.warn('GrowthBook key not set');
    return null;
  }
  return gb;
};

import { Organization } from '@/src/types/services/clients';
import useSWR from 'swr';

export const useGetClients = (isFuseUser?: boolean) => {
  const { data, error, isLoading } = useSWR<Organization[]>(isFuseUser ? '/auth/clients' : null);
  return {
    clients: data,
    isLoading,
    error: error,
  };
};

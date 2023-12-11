import { Formulas } from '@/src/types/services/workflows';
import useSWR from 'swr';

export const useGetFormulas = () => {
  const { data, error, isLoading } = useSWR<Formulas[]>('/environmentVariables/formulas');

  return {
    formulas: data,
    isLoading,
    error: error,
  };
};

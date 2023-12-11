import { Test } from '@/src/types/services/tests';
import { KeyedMutator } from 'swr';

export interface IndividualTestOutletContextProps {
  refetchTests: KeyedMutator<Test[]>;
}

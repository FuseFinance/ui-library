import { Organization } from '@/src/types/services/clients';

export interface ILayoutOptions {
  selectedVersion?: any;
  selectedWorkflow?: any;
  versions?: any;
  featureBranches?: any;
  hideSideBar?: boolean;
  hideNavBar?: boolean;
  children?: any;
  userLogged?: any;
  rehydrate?: () => void;
  clients: Organization[];
}

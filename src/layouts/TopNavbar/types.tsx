import { Organization } from '@/src/types/services/clients';

export type WithClients = {
  clients: Organization[];
};
export interface INavbar {
  selectedWorkflow?: any;
  isEditing?: boolean;
  hydrateData?: () => void;
  hideNav?: boolean;
  setIsEditing: (_isEditing: boolean) => void;
}

export interface NavBarFullProps {
  showNavIcon?: boolean;
  displayWorkflowName?: React.ReactNode;
  actionArea?: React.ReactNode;
}

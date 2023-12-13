import { NavIcon, NavbarContainer } from './styles';
import { ReactComponent as IconFuse } from '@/src/components/Logo/FuseIcon.svg';

import SelectVersions from '@/src/components/SelectVersions';
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, MenuProps, Space, Spin } from 'antd';
import { useActiveUser } from '@/src/contexts/UserProvider/hooks';
import { useGetClients } from '@/src/services/clients';
import { useErrorHandler } from '@/src/hooks/errorHandlers';
import { getPermissions } from '@/src/utils/permissionsHelper';
import Icon from '@/src/components/Icons';
import { IconList } from '@/src/components/Icons/types';
import { NavBarFullProps } from './types';
import env from '@constants/env';

const NavBarFull = ({ showNavIcon, displayWorkflowName, actionArea }: NavBarFullProps) => {
  const { role, permissions } = useActiveUser();
  const { isFuseUser } = getPermissions(role, permissions);
  const { handleError } = useErrorHandler();

  const { clients = [], isLoading } = useGetClients(isFuseUser);

  const navigate = useNavigate();

  const isSameClient = (currentClient: string, selectedClient: string): boolean => {
    return currentClient.toLocaleLowerCase() === selectedClient.toLocaleLowerCase();
  };

  const handleSelectedClient = (clientSelected: any) => {
    try {
      const { key: clientName } = clientSelected;
      const selectedClient = clients.find((c) => c.display_name === clientName);
      const currentClient = env.FRONT_CLIENT;

      if (!selectedClient) {
        throw new Error(`${clientName} client not found`);
      }
      if (!currentClient) {
        throw new Error('VITE_FRONT_CLIENT not found');
      }
      // Avoid redirection when the same client is selected
      if (isSameClient(currentClient, selectedClient.name)) return;
      setTimeout(() => {
        window.location.replace(`${selectedClient.metadata.homeUrl}?redirected=true`);
      }, 100);
    } catch (e) {
      handleError(e);
    }
  };

  const menuItens: MenuProps['items'] = Array.isArray(clients)
    ? clients.map((c) => ({
        key: c.display_name,
        label: c.display_name,
      }))
    : [];

  const menuProps = {
    items: menuItens,
    onClick: handleSelectedClient,
  };

  const clientSelector = isLoading ? (
    <Spin />
  ) : (
    <Dropdown menu={menuProps}>
      <Button>
        <Space>
          {env.FRONT_CLIENT}
          <Icon cursor="pointer" icon={IconList.ChevronDown} width="10" height="10" />
        </Space>
      </Button>
    </Dropdown>
  );

  return (
    <NavbarContainer>
      <div className="flex flex-row items-center">
        {showNavIcon ? (
          <NavIcon onClick={() => navigate('/')}>
            <IconFuse width="1.575em" />
          </NavIcon>
        ) : null}
        {isFuseUser ? <div className="mr-4">{clientSelector}</div> : null}
        <SelectVersions />
        {displayWorkflowName}
      </div>

      <div>{actionArea}</div>
    </NavbarContainer>
  );
};

export default NavBarFull;

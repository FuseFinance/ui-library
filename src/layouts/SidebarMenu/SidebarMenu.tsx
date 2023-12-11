import colors from '@/src/styles/colors';
import Icon from '../../components/Icons';
import {
  FooterSidebar,
  Label,
  StyledSubItem,
  SubItemText,
  UserNameInfo,
  Profile,
  Logout,
  HeaderContainer,
  Item,
  SideBarContainer,
} from './styles';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ItemList } from './types';
import { IconList } from '../../components/Icons/types';
import { RoutesHref } from '@/src/utils/types/sharedEnums';
import { useActiveUser } from '@/src/contexts/UserProvider/hooks';
import { useAuth0 } from '@auth0/auth0-react';
import { localStorageKeys } from '@/src/utils/types/localstorageKeys';
import { SidebarMenuIds } from '@/src/constants/appIDS';
import { useGrowthBook } from '@/src/hooks/growthBook';
import { flags } from '@/src/types/growthBook/featureFlags';

const SidebarMenu = () => {
  const { evalFeaturebyStage, evalFlag } = useGrowthBook();
  const showDbSchema = evalFeaturebyStage(flags.DB_SCHEMA);
  const showTempData = evalFlag(flags.PAGE_TEMP_DATA);
  const showDBConnection = evalFeaturebyStage(flags.DB_CONNECTION);
  const showNotificationsConfig = evalFlag(flags.PAGE_NOTIFICATIONS_CONFIG);
  const showScheduledConfig = evalFlag(flags.PAGE_SCHEDULED_CONFIG);

  const { user } = useActiveUser();
  const { logout } = useAuth0();
  const [hoveredItemIndex, setHoveredItemIndex] = useState(-1);
  const [hoveredSubItemIndex, setHoveredSubItemIndex] = useState(-1);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const handleItemHover = (index: number) => {
    setHoveredItemIndex(index);
  };
  const handleSubItemHover = (index: number) => {
    setHoveredSubItemIndex(index);
  };

  const handleActive = (indexSubItem: number, indexItem: number, href: string) => {
    navigate(href);
  };

  const fill = (i: number, x: number, href: string, subitemName: string) => {
    if (hoveredItemIndex === i && hoveredSubItemIndex === x) {
      return colors.fuseBlue;
    } else if (path.includes('versions') && subitemName.toLowerCase() === 'versions') {
      return colors.fuseBlue;
    } else if (path.includes('workflows') && subitemName.toLowerCase() === 'workflows') {
      return colors.fuseBlue;
    } else if (path.includes('history') && subitemName.toLowerCase() === 'history') {
      return colors.fuseBlue;
    } else if (path.includes('variables') && subitemName.toLowerCase() === 'variables') {
      return colors.fuseBlue;
    } else if (path.includes('tempdata') && subitemName.toLowerCase() === 'temporary data') {
      return colors.fuseBlue;
    } else {
      return colors.fuseGray1;
    }
  };

  const checkActiveRoute = (subitemName: string) => {
    if (path.includes('workflows') && subitemName.toLowerCase() === 'workflows') {
      return true;
    } else if (path.includes('versions') && subitemName.toLowerCase() === 'versions') {
      return true;
    } else if (path.includes('history') && subitemName.toLowerCase() === 'history') {
      return true;
    } else if (path.includes('variables') && subitemName.toLowerCase() === 'variables') {
      return true;
    } else if (path.includes('tempdata') && subitemName.toLowerCase() === 'temporary data') {
      return true;
    } else if (path.includes('scheduled') && subitemName.toLowerCase() === 'scheduled') {
      return true;
    } else {
      return false;
    }
  };

  const onLogout = () => {
    localStorage.removeItem(localStorageKeys.ACCESS_TOKEN);
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const sidemenuItens: ItemList[] = [
    {
      label: 'Build',
      subItems: [
        {
          icon: IconList.Workflow,
          text: 'Workflows',
          href: RoutesHref.WORKFLOWS,
        },
      ],
    },
    {
      label: 'Review',
      subItems: [
        {
          icon: IconList.Queues,
          text: 'Versions',
          href: RoutesHref.VERSIONS,
        },
        {
          icon: IconList.Clock,
          text: 'History',
          href: '/history',
        },
        {
          icon: IconList.Link,
          text: 'Variables',
          href: '/variables',
        },
      ],
    },
  ];

  if (showDbSchema) {
    sidemenuItens[0].subItems.push({
      icon: IconList.Group,
      text: 'DB Schema',
      href: RoutesHref.WORKFLOWS,
    });
  }

  if (showNotificationsConfig) {
    sidemenuItens[1].subItems.push({
      icon: IconList.Bell,
      text: 'Notifications',
      href: '/notifications',
    });
  }

  if (showTempData) {
    sidemenuItens[1].subItems.push({
      icon: IconList.Data,
      text: 'Temporary Data',
      href: '/tempdata',
    });
  }
  if (showDBConnection) {
    sidemenuItens[0].subItems.push({
      icon: IconList.DBQuery,
      text: 'DB Connection',
      href: RoutesHref.DB_CONNECTION,
    });
  }
  if (showScheduledConfig) {
    sidemenuItens[1].subItems.push({
      icon: IconList.Calendar,
      text: 'Scheduled',
      href: RoutesHref.SCHEDULED,
    });
  }

  return (
    <SideBarContainer>
      <div className="flex-auto">
        <HeaderContainer>
          <img className="w-20" src="/Logo.png" alt="Fuse Finance Logo" />
        </HeaderContainer>
        <div className="grid gap-4">
          {sidemenuItens.map((item, i) => (
            <Item
              key={i}
              onMouseEnter={() => handleItemHover(i)}
              onMouseLeave={() => handleItemHover(i)}
            >
              <Label>{item.label}</Label>
              <div className="grid gap-1">
                {item.subItems.map((subitem, x) => (
                  <StyledSubItem
                    key={x}
                    onMouseEnter={() => handleSubItemHover(x)}
                    onMouseLeave={() => handleSubItemHover(-1)}
                    onClick={() => handleActive(x, i, subitem.href)}
                    active={`${checkActiveRoute(subitem.text)}`}
                  >
                    <Icon
                      width="16"
                      height="16"
                      icon={subitem.icon}
                      fill={fill(i, x, subitem.href, subitem.text)}
                    />
                    <SubItemText className="text-gray-800">{subitem.text}</SubItemText>
                  </StyledSubItem>
                ))}
              </div>
            </Item>
          ))}
        </div>
      </div>
      <FooterSidebar>
        <Logout data-cy={SidebarMenuIds.logoutBtn} onClick={onLogout}>
          <Icon width="16" height="16" icon={IconList.Logout} />
          <p className="font-medium ml-2 text-[0.75rem]">{'Logout'}</p>
        </Logout>
        <Profile>
          <img width="24" height="24" className="rounded-full" src={user.picture} alt="" />
          <UserNameInfo>
            <p className="text-gray-600 text-xs font-medium">
              {user.email.length > 26 ? `${user.email.substr(0, 26)}...` : user.email}
            </p>
          </UserNameInfo>
        </Profile>
      </FooterSidebar>
    </SideBarContainer>
  );
};
export default SidebarMenu;

import React, { useState } from 'react';
import { SidebarParent, MainContent } from './styles';
import SidebarMenu from '@/src/layouts/SidebarMenu';
import { displayComponentsByRoute } from '@/src/utils/routerHelper';
import { useLocation } from 'react-router-dom';

const calcMargin = (isSidebarHidden?: boolean) => {
  if (!isSidebarHidden) return '16rem';
  return '0';
};

const DashboardLayout = ({ children }: { children: React.ReactElement }) => {
  const location = useLocation();

  const [isEditing, setIsEditing] = useState(false);
  const { hideSideBar } = displayComponentsByRoute(location.pathname);

  return (
    <div className="h-full">
      {!hideSideBar && (
        <SidebarParent>
          <SidebarMenu />
        </SidebarParent>
      )}
      <div style={{ marginLeft: calcMargin(hideSideBar) }}>
        <MainContent>
          {React.cloneElement(children, {
            isEditing: isEditing,
            setIsEditing: setIsEditing,
          })}
        </MainContent>
      </div>
    </div>
  );
};

export default DashboardLayout;

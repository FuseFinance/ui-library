import colors from '@/src/styles/colors';
import styled from 'styled-components';
import tw from 'tailwind-styled-components';
import { StyledSubItemProps } from './types';

export const SideBarContainer = tw.div`
  w-64 bg-white border-r border-gray-300 h-full flex flex-col
`;

export const HeaderContainer = tw.div`
  px-4 h-12 flex items-center mb-3
`;

export const Item = tw.div``;

export const Label = tw.p`
  text-xs capitalize font-medium mb-2 text-gray-700 ml-4
`;
export const FooterSidebar = tw.footer`grid`;

export const SubItemText = styled.p<StyledSubItemProps>`
  margin-left: 0.5rem;
  align-self: center;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.75rem;
`;

export const UserNameInfo = tw.div`ml-2`;

export const StyledSubItem = styled.div<StyledSubItemProps>`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  margin: 0 0.5rem;
  background: ${(props) => (props.active == 'true' ? colors.fuseBlueLightest : 'transparent')};

  &:hover {
    background: ${colors.fuseBlueLightest};
  }
`;

export const Profile = tw.div`
  border-t border-gray-300 flex items-center px-3 py-2
`;

export const Logout = tw.div`
  px-3 py-1 cursor-pointer hover:bg-blue-100 hover:text-blue-500
  flex items-center text-gray-600 text-sm mb-2 rounded mx-3
`;

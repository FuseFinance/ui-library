import { IconList } from '../../components/Icons/types';
// import { ILayoutOptions } from '../MainLayout/types'

export type SubItems = {
  icon: IconList;
  text: string;
  href: string;
};
export type ItemList = {
  label: string;
  subItems: SubItems[];
  // navOptions?: ILayoutOptions
};

export interface ISideBarMenu {
  user: any;
}
export type StyledSubItemProps = {
  active?: string;
  colorText?: string;
};

import { RoutesHref } from './types/sharedEnums';

interface IDisplayComponentsByRouteReturn {
  hideNavBar: boolean;
  hideSideBar: boolean;
}

export const displayComponentsByRoute = (routeHref: string): IDisplayComponentsByRouteReturn => {
  let hideNavBar = false;
  let hideSideBar = false;

  if (routeHref === `${RoutesHref.VERSIONS}`) {
    hideNavBar = true;
  }
  if (routeHref.includes(`${RoutesHref.HISTORY}`)) {
    hideNavBar = true;
  }
  if (routeHref.startsWith(RoutesHref.EDITOR) || routeHref.startsWith(RoutesHref.TEST)) {
    hideSideBar = true;
  }
  return { hideNavBar, hideSideBar };
};

export const isInWorkflowEditor = (routeHref: string | null): boolean => {
  if (!routeHref) return false;
  return routeHref.startsWith(RoutesHref.EDITOR);
};

export const isInTestingPage = (routeHref: string | null): boolean => {
  if (!routeHref) return false;
  return routeHref.startsWith(RoutesHref.TEST);
};

export const isVersions = (routeHref: string | null): boolean => {
  if (!routeHref) return false;
  return routeHref === `${RoutesHref.VERSIONS}`;
};

export const isNotVersionedRoute = (routeHref: string) => {
  const NON_VERSIONED_ROUTES = [RoutesHref.VERSIONS];
  return NON_VERSIONED_ROUTES.filter((route) => route === routeHref).length !== 0;
};

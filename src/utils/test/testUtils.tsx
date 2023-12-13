import React, { ReactElement } from 'react';
import { render, queries, within, RenderOptions } from '@testing-library/react';
import { ActiveUserContext, IActiveUserContext } from '@/src/contexts/UserProvider/context';
import { VersionContext, IVersionContext } from '@/src/contexts/VersionProvider/context';
import { permissions, role, user } from '@/__mocks__/activeUserContextMock';
import { mockVersions } from '@/__mocks__/versionsContextMock';
import * as cyQuesries from './cyQuery';

type TAllProviders = {
  activeUserContext?: IActiveUserContext;
  versionContext?: IVersionContext;
};

const composedQueries = {
  ...queries,
  ...cyQuesries, // As we also test with Cypress, we'll be able to query by data-cy -> test-id for Cypress in unit and integration test.
};

const AllProviders = ({
  children,
  activeUserContext,
  versionContext,
}: TAllProviders & { children: React.ReactNode }) => {
  const setupUserContext = {
    permissions,
    role,
    user,
    ...activeUserContext,
  };
  const setupVersionsContext = {
    ...mockVersions,
    ...versionContext,
  };

  return (
    <ActiveUserContext.Provider value={setupUserContext}>
      <VersionContext.Provider value={setupVersionsContext}>{children}</VersionContext.Provider>
    </ActiveUserContext.Provider>
  );
};

const customScreen = within(document.body, composedQueries);
const customWithin = (element: HTMLElement) => within(element, composedQueries);
const customRender = (
  ui: ReactElement,
  {
    providerProps,
    ...options
  }: { providerProps?: TAllProviders } & Omit<RenderOptions, 'wrapper' | 'queries'>,
) =>
  render(<AllProviders {...providerProps}>{ui}</AllProviders>, {
    queries: composedQueries,
    ...options,
  });

export * from '@testing-library/react';
export { customScreen as screen, customRender as render, customWithin as within };

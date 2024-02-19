import { ReactElement } from 'react';
import { render, queries, within, RenderOptions } from '@testing-library/react';
import * as cyQuesries from './cyQuery';

const composedQueries = {
  ...queries,
  ...cyQuesries,
};

const customScreen = within(document.body, composedQueries);
const customWithin = (element: HTMLElement) => within(element, composedQueries);

const customRender = (
  ui: ReactElement,
  { ...options }: Omit<RenderOptions, 'wrapper' | 'queries'>,
) =>
  render(ui, {
    queries: composedQueries,
    ...options,
  });

export * from '@testing-library/react';
export { customScreen as screen, customRender as render, customWithin as within };

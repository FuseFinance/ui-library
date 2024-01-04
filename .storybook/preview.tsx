import React from 'react';
import type { Preview } from '@storybook/react';
import 'reactflow/dist/style.css';
import reportWebVitals from '../src/reportWebVitals';
import './style.css';
import '../src/styles/global.css';
import ThemeConfigProvider from '../src/styles/themeConfigProvider';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeConfigProvider>
        <Story />
      </ThemeConfigProvider>
    ),
  ], 
};

reportWebVitals();

export default preview;




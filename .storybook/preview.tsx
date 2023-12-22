import React from 'react';
import type { Preview } from '@storybook/react';
import '../src/styles/global.css';
import 'reactflow/dist/style.css';
import reportWebVitals from '../src/reportWebVitals';
import colors from '../src/styles/colorsGlobal';
import './style.css';

import { ConfigProvider } from 'antd';

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
      <ConfigProvider theme={{ 
        token: { 
          fontFamily:"'Inter', sans-serif", 
          colorText: colors.blue[900], 
          colorBorder: colors.gray[400],
          colorPrimary: colors.blue[600],
          colorError: colors.red[600],
          colorTextDisabled : colors.gray[300],
        } 
        }}>
        <Story />
      </ConfigProvider>
    ),
  ], 
};

reportWebVitals();

export default preview;




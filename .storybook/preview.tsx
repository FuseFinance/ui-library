import React from 'react';
import ReactDOM from 'react-dom';
import type { Preview } from '@storybook/react';
import { GlobalStyle } from '../src/styles';
import '../src/index.css';
import '../src/styles/global.css';
import 'reactflow/dist/style.css';
import reportWebVitals from '../src/reportWebVitals';
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
      <ConfigProvider theme={{ token: { colorText: '#002140', colorBorder: '#C9D3E0' } }}>
        <GlobalStyle/>
        <Story />
      </ConfigProvider>
    ),
  ], 
};

reportWebVitals();

export default preview;




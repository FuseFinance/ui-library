import React from 'react';
import ReactDOM from 'react-dom';
import type { Preview } from '@storybook/react';
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
      <ConfigProvider theme={{ 
        token: { 
          fontFamily:"'Inter', sans-serif", 
          colorText: '#002140', 
          colorBorder: '#C9D3E0',
          colorPrimary: '#0A38C2'
        } 
        }}>
        <Story />
      </ConfigProvider>
    ),
  ], 
};

reportWebVitals();

export default preview;




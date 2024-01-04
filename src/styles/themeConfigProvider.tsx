import { ConfigProvider } from 'antd';
import colors from '@styles/colorsGlobal';
import React, { ReactNode } from 'react';


const ThemeConfigProvider: React.FC<ThemeConfigProviderProps> = ({children})=> {

    return (<ConfigProvider theme={{ 
        token: { 
          fontFamily:"'Inter', sans-serif", 
          colorText: colors.blue[900], 
          colorBorder: colors.gray[400],
          colorPrimary: colors.blue[600],
          colorError: colors.red[600],
          colorTextDisabled : colors.gray[300],
          colorBgContainerDisabled: "#ffffff",
          colorSplit: colors.gray[200],
          controlItemBgHover: colors.gray[100],
        } 
        }}>
            {children}
    </ConfigProvider>)
}

export interface ThemeConfigProviderProps {
  children: ReactNode
}

export default ThemeConfigProvider;

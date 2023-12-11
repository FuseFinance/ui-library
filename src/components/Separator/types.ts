/* eslint-disable no-unused-vars */
import { ReactNode } from 'react';

export enum SeparatorContentPosition {
  Left = 'Left',
  Center = 'Center',
  Right = ' Right',
}

export interface SeparatorContainerProps {
  color?: string;
  $lineColor?: string;
  contentPosition?: SeparatorContentPosition;
  space?: string;
}

export interface ISeparatorProps extends SeparatorContainerProps {
  children: ReactNode;
}

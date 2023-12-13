import styled from 'styled-components';
import { SeparatorContainerProps, SeparatorContentPosition } from './types';

const leftStyles = `
justify-content: start;
text-align: left;
&::after {
  content: '';
  display: block;
  height: 0.09em;
  width: 100%;
}
`;

const centerStyles = `
&::before,
&::after {
  content: '';
  display: block;
  height: 0.09em;
  width: 50%;
},
`;

const rightStyles = `
&::before {
  content: '';
  display: block;
  height: 0.09em;
  width: 100%;
}
`;

const styleByPosition = (position: SeparatorContentPosition | undefined) => {
  switch (position) {
    case SeparatorContentPosition.Left:
      return leftStyles;

    case SeparatorContentPosition.Right:
      return rightStyles;
    default:
      return centerStyles;
  }
};

export const SeparatorContainer = styled.p<SeparatorContainerProps>`
  color: ${(props) => props.color};
  font-weight: 500;
  flex-grow: 1;
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.space};
  margin-top: ${(props) => props.space};
  font-family: 'Inter', sans-serif;
  white-space: nowrap;
  &::before {
    margin-right: 1rem;
    background: ${(props) => props.$lineColor};
  }
  &::after {
    margin-left: 1rem;
    background: ${(props) => props.$lineColor};
  }
  ${(props) => styleByPosition(props.contentPosition)}
`;

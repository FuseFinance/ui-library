import { createGlobalStyle } from 'styled-components';
import colors from '@/src/styles/colors';

export const GlobalStyle = createGlobalStyle` 
  * {
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
  }

  body {
    background-color: ${colors.fuseGray6};
  }

  button {
    all: unset;
    cursor: pointer;
  }

  button:focus {
    outline: none;
  }

  //ReactFlow Reset Css
  .react-flow__edge.selected .react-flow__edge-path{
    stroke: ${colors.fuseGray3};
  }

  .react-flow__handle{
    opacity: 0;
  }

  .react-flow__edge .edge_trace_mode{
    stroke: ${colors.fuseBlue};
    opacity: 1;
  }
`;

export const getBorderRadiusValues = (
  borderRadius: 'all' | 'top' | 'bottom' | 'left' | 'right' | undefined,
) => {
  switch (borderRadius) {
    case 'all':
      return `0.2rem`;
    case 'top':
      return `0.2rem 0.2rem 0 0`;
    case 'bottom':
      return `0 0 0.2rem 0.2rem`;
    case 'left':
      return `0.2rem 0 0 0.2rem`;
    case 'right':
      return `0 0.2rem 0.2rem 0`;
    default:
      return `0`;
  }
};

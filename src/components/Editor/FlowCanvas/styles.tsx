import { styled } from 'styled-components';

export const ReactFlowContainer = styled.div<{ width: string; height: string }>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

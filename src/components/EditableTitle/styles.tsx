import tw from 'tailwind-styled-components';
import { WithSize } from './types';

export const InputEditableContainer = tw.div`
  flex flex-row items-center
`;

export const Label = tw.div<WithSize>`
  font-semibold text-blue-900 text-${(props) => props.$size}
`;

export const InputEditable = tw.input<WithSize>`
  border-none p-0 m-0 w-full focus:outline-none text-blue-900 font-semibold text-${(props) =>
    props.$size}
`;

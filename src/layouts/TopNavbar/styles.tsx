import tw from 'tailwind-styled-components';

export const NavbarContainer = tw.div`
  h-12 flex items-center justify-between px-6 bg-white border-b border-gray-300 w-full
`;

export const NavIcon = tw.a`
  flex mr-4 cursor-pointer
`;

export const IconUndoRedo = tw.a`
  block mr-3 cursor-pointer
`;

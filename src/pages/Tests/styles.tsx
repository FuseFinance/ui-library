import tw from 'tailwind-styled-components';

export const Container = tw.div`
  flex flex-col h-full grow flex-1
`;

export const ExecutionsContainer = tw.div`
  flex bg-gray-100 gap-4
`;

export const HeaderExecutions = tw.div`
  text-base text-gray-800 border-b border-gray-300 pb-2 mb-4 font-semibold
`;

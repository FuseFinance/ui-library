import colors from '@/src/styles/colors';
import { SeparatorContainer } from './styles';
import { ISeparatorProps } from './types';

const Separator = ({
  children,
  color = colors.fuseGray3,
  $lineColor = colors.fuseGray4,
  contentPosition,
  space = '1rem',
}: ISeparatorProps) => {
  return (
    <SeparatorContainer
      color={color}
      $lineColor={$lineColor}
      contentPosition={contentPosition}
      space={space}
    >
      {children}
    </SeparatorContainer>
  );
};

export default Separator;

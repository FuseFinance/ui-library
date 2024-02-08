import { colors } from '@/src/styles';
import { TooltipProps } from './types';

export const TooltipFuse = ({ type = '', width = '100%', active = false }: TooltipProps) => {
  if (!active) return;

  return (
    <div
      id="tooltip-fuse"
      className="mt-[1px] px-1 py-[3px] rounded text-xs font-medium"
      style={{
        width,
        border: `1px solid ${colors.gray[700]}`,
        backgroundColor: colors.gray[50],
      }}
    >
      <span
        style={{
          color: colors.gray[700],
        }}
        className="text-sm"
      >
        Type: <span className="ml-1">{type}</span>
      </span>
    </div>
  );
};

import { ReactNode } from 'react';

interface MarkerProps {
  id: string;
  className?: string;
  children: ReactNode;
}

const Marker = ({ id, className, children }: MarkerProps) => (
  <marker
    className={className || 'react-flow__arrowhead'}
    id={id}
    markerWidth="20"
    markerHeight="20"
    viewBox="-10 -10 20 20"
    orient="auto"
    markerUnits="userSpaceOnUse"
    refX="0"
    refY="0"
  >
    {children}
  </marker>
);

interface MarkerDefinitionsProps {
  id: string;
  color: string;
}

export function MarkerDefinition({ color, id }: MarkerDefinitionsProps) {
  return (
    <svg>
      <defs>
        <Marker id={id}>
          <polyline
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            fill={color}
            points="-12,-8 0,0 -12,8 -12,-8"
          />
        </Marker>
      </defs>
    </svg>
  );
}

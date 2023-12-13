export interface WithSize {
  $size?: 'xs' | 'sm' | 'base' | 'md' | 'xl' | '2xl' | '3xl';
}

export interface IEditLabelProps {
  label: string;
  onLabelChange: (_value: string) => void;
  onSpanClick?: () => void;
  canEdit?: boolean;
  initEdit?: boolean,
}

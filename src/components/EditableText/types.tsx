export interface WithSize {
  $size?: 'sm' | 'md' | 'xl' | '2xl' | '3xl';
}

export interface IEditLabelProps {
  label: string;
  onLabelChange: (_value: string) => void;
  canEdit?: boolean;
}

import { SizeGlobalValue } from '@/src/types/globalDesign/size';

export interface WithSize {
  $size?: SizeGlobalValue;
}

export interface IEditLabelProps {
  label: string;
  onLabelChange: (_value: string) => void;
  onSpanClick?: () => void;
  customAttrInput?: Record<string, string>,
  customAttrText?: Record<string, string>  
  canEdit?: boolean;
  initEdit?: boolean,
}

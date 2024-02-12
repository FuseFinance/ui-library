export interface TypeInputTableSimple {
  onAddRow?: (_allCell: Record<string, any>[], _newRow: Record<string, any>) => void;
  onAddColumn?: (_allCell: Record<string, any>[], _newColumn: Record<string, any>) => void;
  onRowRemove?: (_allCell: Record<string, any>[], _newRow: Record<string, any>) => void;
  onColumnRemove?: (_allCell: Record<string, any>[], _removeColumn: Record<string, any>[]) => void;
  cellToAdd?: Record<string, any>;
  canAddRows?: boolean;
  canAddColumn?: boolean;
  value?: Record<string, any>[][];
  defaultValue?: Record<string, any>[][];
  className?: string;
  style?: Record<string, any>;
  name?: string;
  customAttr?: Record<string, any>;
}

// DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

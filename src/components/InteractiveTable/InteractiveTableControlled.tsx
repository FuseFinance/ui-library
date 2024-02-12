import { TypeInputTableSimple } from './type';
import { forwardRef, ForwardedRef, useState } from 'react';
import InteractiveTableUncontrolled from './InteractiveTableUncontrolled';

const InteractiveTableControlled = forwardRef(
  (props: TypeInputTableSimple, ref: ForwardedRef<HTMLDivElement>) => {
    const { defaultValue, onAddColumn, onAddRow, onColumnRemove, onRowRemove, ...rest } = props;

    const [tableData, setTableData] = useState(defaultValue);

    const handleUpdateTable = (allTableData) => {
      setTableData(allTableData);
    };

    const handleRowRemove = (allTableData, removeRow) => {
      handleUpdateTable(allTableData);
      if (onRowRemove) onRowRemove(allTableData, removeRow);
    };

    const handleColumnRemove = (allTableData, removeColumn) => {
      handleUpdateTable(allTableData);
      if (onColumnRemove) onColumnRemove(allTableData, removeColumn);
    };

    const handleAddRow = (allTableData, newRow) => {
      handleUpdateTable(allTableData);
      if (onAddRow) onAddRow(allTableData, newRow);
    };

    const handleAddColumn = (allTableData, newColumn) => {
      handleUpdateTable(allTableData);
      if (onAddColumn) onAddColumn(allTableData, newColumn);
    };

    return (
      <InteractiveTableUncontrolled
        onAddColumn={handleAddColumn}
        onAddRow={handleAddRow}
        onColumnRemove={handleColumnRemove}
        onRowRemove={handleRowRemove}
        ref={ref}
        value={tableData}
        {...rest}
      />
    );
  },
);

InteractiveTableControlled.displayName = 'InteractiveTableControlled';

export default InteractiveTableControlled;

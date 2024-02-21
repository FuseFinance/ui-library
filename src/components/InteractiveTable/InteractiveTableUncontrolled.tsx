import { Dropdown } from 'antd';
import { jsonStringifyDeep } from '@utils/deep';
import { useState, useRef, forwardRef, ForwardedRef, useEffect, useReducer } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import cn from 'classnames';

import { IconList } from '@/src/components/Icons/types';
import color from '@/src/styles/colorsGlobal';
import Icon from '@/src/components/Icons';

import {
  cellExport,
  columnRemove,
  insertColumn,
  insertRow,
  reducerDropdownState,
  rowRemove,
} from './helper';
import type { TypeInputTableSimple } from './type';

import './InteractiveTable.css'; // FIXME

const InteractiveTableUncontrolled = forwardRef(
  (props: TypeInputTableSimple, parentRef: ForwardedRef<HTMLDivElement>) => {
    const {
      canAddColumn = false,
      canAddRows = false,
      cellToAdd,
      className,
      customAttr, // FIXME type, not needed
      name,
      onAddColumn,
      onAddRow,
      onColumnRemove,
      onRowRemove,
      style,
      value,
    } = props;

    const [cellData, setCellData] = useState(value);
    const [hoverTable, setHoverTable] = useState<boolean>(null);
    const [stateDropdownState, dispatchDropdownState] = useReducer(reducerDropdownState, {
      dropdown: {
        isOpen: false,
        axis: undefined,
      },
    });

    const internalRef = useRef<HTMLDivElement>(null);
    const optionRowSelectIdRef = useRef<number>(null);
    const optionColumnSelectIdRef = useRef<number>(null);
    const contentRef = parentRef || internalRef;

    const prevInitCellData = useRef(value);
    // const prevInitCellData = useMemo(() => initCellData, [initCellData]);

    useEffect(() => {
      if (jsonStringifyDeep(prevInitCellData.current) != jsonStringifyDeep(value)) {
        const cellData = cloneDeep(value);
        setCellData(cellData);
        prevInitCellData.current = cellData;
      }
    }, [value]);
    // useEffect(() => {
    //     setCellData(cellData)
    // }, [initCellData]);

    // TODO: Fix eslit rules to throw errors
    const handleInsertRow = ({ rowId, cellData, cellToAdd, typeInsert, contentRef }) => {
      if (!onAddRow) return;

      const [newTableData, newRow] = insertRow({
        rowId,
        cellData,
        cellToAdd,
        typeInsert,
        contentRef,
      });

      onAddRow(newTableData, [newRow]);
    };

    const handleRowRemove = ({ rowId, cellData }) => {
      if (!onRowRemove) return;

      if (cellData.length > 1) {
        // call column remove
        const [newCellData, removeRow] = rowRemove({ rowId, cellData });

        // set new cell
        onRowRemove(newCellData, removeRow);
      }
    };

    const handleInsertColumn = ({ columnId, cellData, cellToAdd, typeInsert, contentRef }) => {
      if (!onAddColumn) return;

      const [newCellData, newColumns] = insertColumn({
        columnId,
        cellData,
        cellToAdd,
        typeInsert,
        contentRef,
      });

      onAddColumn(newCellData, newColumns);
    };

    const handleColumnRemove = ({ columnId, cellData }) => {
      if (!onColumnRemove) return;

      if (cellData[0].length > 1) {
        // call column remove
        const [newCellData, removeColumn] = columnRemove({ columnId, cellData });

        onColumnRemove(newCellData, removeColumn);
      }
    };

    const handleChangeTable = ({
      columnId,
      rowId,
      cellData,
      cellToAdd,
      typeInsert,
      axis,
      contentRef,
    }) => {
      if (axis === 'top') {
        if (typeInsert === 'delete') {
          handleColumnRemove({ columnId, cellData });
          return;
        }

        handleInsertColumn({
          columnId,
          cellData,
          cellToAdd,
          typeInsert,
          contentRef,
        });
      }

      if (axis === 'left') {
        if (typeInsert === 'delete') {
          handleRowRemove({ rowId, cellData });
          return;
        }

        handleInsertRow({
          rowId,
          cellData,
          cellToAdd,
          typeInsert,
          contentRef,
        });
      }
    };

    // list option dropdown top
    const listOptionDropdown = [
      {
        key: '1',
        label: stateDropdownState.dropdown.axis === 'top' ? 'Insert right' : 'Insert up',
        onClick: () =>
          handleChangeTable({
            columnId: optionColumnSelectIdRef.current,
            rowId: optionRowSelectIdRef.current,
            cellData,
            cellToAdd,
            typeInsert: stateDropdownState.dropdown.axis === 'top' ? 'right' : 'up',
            axis: stateDropdownState.dropdown.axis,
            contentRef,
          }),
        icon: (
          <Icon
            fill={color.blue[900]}
            icon={
              stateDropdownState.dropdown.axis === 'top'
                ? IconList.RightInsertArrow
                : IconList.UpArrow
            }
            cursor="pointer"
            width="20px"
            height="20px"
          />
        ),
      },
      {
        key: '2',
        label: stateDropdownState.dropdown.axis === 'top' ? 'Insert left' : 'Insert down',
        onClick: () =>
          handleChangeTable({
            columnId: optionColumnSelectIdRef.current,
            rowId: optionRowSelectIdRef.current,
            cellData,
            cellToAdd,
            typeInsert: stateDropdownState.dropdown.axis === 'top' ? 'left' : 'down',
            axis: stateDropdownState.dropdown.axis,
            contentRef,
          }),
        icon: (
          <Icon
            fill={color.blue[900]}
            icon={
              stateDropdownState.dropdown.axis === 'top'
                ? IconList.LeftInsertArrow
                : IconList.DownArrow
            }
            cursor="pointer"
            width="20px"
            height="20px"
          />
        ),
      },
      {
        key: '3',
        label: 'Duplicate',
        onClick: () =>
          handleChangeTable({
            columnId: optionColumnSelectIdRef.current,
            rowId: optionRowSelectIdRef.current,
            cellData,
            cellToAdd,
            typeInsert: 'clone',
            axis: stateDropdownState.dropdown.axis,
            contentRef,
          }),
        icon: (
          <Icon
            fill={color.blue[900]}
            icon={IconList.Copy}
            cursor="pointer"
            width="20px"
            height="15px"
          />
        ),
      },
      {
        key: '4',
        label: 'Delete',
        onClick: () =>
          handleChangeTable({
            columnId: optionColumnSelectIdRef.current,
            rowId: optionRowSelectIdRef.current,
            cellData,
            cellToAdd,
            typeInsert: 'delete',
            axis: stateDropdownState.dropdown.axis,
            contentRef,
          }),
        icon: (
          <Icon
            fill={color.blue[900]}
            icon={IconList.Trash}
            cursor="pointer"
            width="20px"
            height="16px"
          />
        ),
      },
    ];

    return (
      <div
        {...customAttr}
        name={name}
        style={style}
        ref={contentRef}
        className={cn('uid-interactive-table', className, hoverTable ? 'hover-table' : '')}
      >
        <table className="uid-interactive-table-data w-full">
          <colgroup></colgroup>
          <tbody className="uid-interactive-table-body">
            {cellData.map((row) => {
              const rowId = row[0].rowId;

              return (
                <tr className="uid-interactive-table-row" data-ui-row-id={rowId} key={rowId}>
                  {row.map((cell) => {
                    const columnId = cell.columnId;

                    return (
                      <td
                        {...cellExport({
                          rowId,
                          columnId,
                          contentRef,
                          setHoverTable,
                          optionRowSelectIdRef,
                          optionColumnSelectIdRef,
                        })}
                        className={cn('uid-interactive-table-cell', cell.type)}
                        data-ui-column-id={cell.columnId}
                        key={cell.columnId}
                      >
                        {cell.render(cell)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* <DropdownButton axis='' ></DropdownButton> */}

        {canAddColumn && (
          <div
            data-is-active={
              stateDropdownState.dropdown.isOpen && stateDropdownState.dropdown.axis === 'top'
            }
            className={`uid-table-option uid-table-option-top`}
          >
            {stateDropdownState.dropdown.axis != 'left' && (
              <>
                {' '}
                <div className="uid-dropdown-content-in-table-option z-10">
                  <Dropdown
                    trigger={['click']}
                    menu={{
                      items: listOptionDropdown,
                    }}
                    onOpenChange={(isActive) =>
                      dispatchDropdownState({
                        axis: isActive ? 'top' : '',
                      })
                    }
                    placement="bottomLeft"
                  >
                    <div className="bg-gray-300 rounded">
                      <Icon
                        icon={IconList.Menu}
                        fill="#fff"
                        cursor="pointer"
                        width="22px"
                        height="13px"
                      />
                    </div>
                  </Dropdown>
                </div>
                <div className="uid-option-line"></div>
              </>
            )}
          </div>
        )}
        {canAddRows && (
          <div
            data-is-active={
              stateDropdownState.dropdown.isOpen && stateDropdownState.dropdown.axis === 'left'
            }
            className={`uid-table-option uid-table-option-left`}
          >
            {stateDropdownState.dropdown.axis != 'top' && (
              <>
                <div className="uid-dropdown-content-in-table-option z-10">
                  <Dropdown
                    trigger={['click']}
                    menu={{
                      items: listOptionDropdown,
                    }}
                    onOpenChange={(isActive) =>
                      dispatchDropdownState({
                        axis: isActive ? 'left' : '',
                      })
                    }
                    placement={'rightTop' as any}
                  >
                    <div className="bg-gray-300 rounded">
                      <Icon
                        icon={IconList.MenuVertiacal}
                        fill="#fff"
                        cursor="pointer"
                        width="13px"
                        height="22px"
                      />
                    </div>
                  </Dropdown>
                </div>
                <div className="uid-option-line"></div>
              </>
            )}
          </div>
        )}
        {canAddColumn && (
          <div className="add-bottom-data add-bottom-column h-full absolute pl-0.9 pr-1">
            <div
              className="bg-gray-200 h-full rounded flex items-center p-0.9"
              role="button"
              onKeyDown={() => {
                handleInsertColumn({
                  columnId: cellData[0][cellData[0].length - 1].columnId,
                  cellData,
                  cellToAdd,
                  typeInsert: 'right',
                  contentRef,
                });
              }}
              tabIndex={0}
              onClick={() => {
                handleInsertColumn({
                  columnId: cellData[0][cellData[0].length - 1].columnId,
                  cellData,
                  cellToAdd,
                  typeInsert: 'right',
                  contentRef,
                });
              }}
            >
              <Icon
                icon={IconList.Plus}
                fill={color.gray[400]}
                cursor="pointer"
                width="8px"
                height="8px"
              />
            </div>
          </div>
        )}
        {canAddRows && (
          <div className="add-bottom-data add-bottom-row absolute w-full pt-0.9 pb-1">
            <div
              className="bg-gray-200 w-full rounded flex justify-center p-0.9"
              role="button"
              onKeyDown={() => {
                handleInsertRow({
                  rowId: cellData[cellData.length - 1][0].rowId,
                  cellData,
                  cellToAdd,
                  typeInsert: 'down',
                  contentRef,
                });
              }}
              tabIndex={0}
              onClick={() => {
                handleInsertRow({
                  rowId: cellData[cellData.length - 1][0].rowId,
                  cellData,
                  cellToAdd,
                  typeInsert: 'down',
                  contentRef,
                });
              }}
            >
              <Icon
                icon={IconList.Plus}
                fill={color.gray[400]}
                cursor="pointer"
                width="8px"
                height="8px"
              />
            </div>
          </div>
        )}
      </div>
    );
  },
);

InteractiveTableUncontrolled.displayName = 'InteractiveTableUncontrolled';

export default InteractiveTableUncontrolled;

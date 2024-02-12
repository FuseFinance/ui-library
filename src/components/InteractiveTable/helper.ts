import { MutableRefObject } from 'react';
import { idNew } from '@/src/utils/ids';
import _ from 'lodash';

// chagen positon of option cell
export const chagenOptionCellPositon = ({
  rowId,
  columnId,
  contentRef,
  udpateOption,
}: {
  rowId: number;
  columnId: number;
  udpateOption?: 'top' | 'left';
  contentRef: MutableRefObject<HTMLDivElement>;
}) => {
  // validate data
  if (!rowId || !columnId) {
    return;
  }

  // get dom
  const optionTop: HTMLDivElement = contentRef.current.querySelector('.uid-table-option-top');
  const optionLeft: HTMLDivElement = contentRef.current.querySelector('.uid-table-option-left');

  // get data cell
  const cellElement = getCellElement({ contentRef, rowId, columnId });

  if (!cellElement) {
    return;
  }

  const cellHeight = cellElement.offsetHeight;
  const cellWidth = cellElement.offsetWidth;

  // get tabla
  const tableElement = contentRef.current.querySelector('.uid-interactive-table-data');

  // get table position
  const rectTable = tableElement.getBoundingClientRect();
  const docXTable = rectTable.left;
  const docYTable = rectTable.top;

  // get cell position
  const rectCell = cellElement.getBoundingClientRect();
  const docXCellInTable = rectCell.left - docXTable;
  const docYCellInTable = rectCell.top - docYTable;

  // change coordinates
  if (optionTop && (udpateOption === 'top' || !udpateOption)) {
    // calc position option top
    const optionTopHeightContent: HTMLDivElement = optionTop.querySelector(
      '.uid-dropdown-content-in-table-option',
    );

    const optionTopHeight = optionTopHeightContent.offsetHeight;

    optionTop.style.top = '0px';
    optionTop.style.left = docXCellInTable + 'px';

    const dropdownContent = optionTop.querySelector(
      '.uid-dropdown-content-in-table-option',
    ) as HTMLDivElement;
    dropdownContent.style.left = (cellWidth - optionTopHeight) / 2 + 'px';

    // calc position option top line
    const optionLeftLine = optionTop.querySelector('.uid-option-line') as HTMLDivElement;
    optionLeftLine.style.height = tableElement.clientHeight + 'px';
    optionLeftLine.style.width = cellWidth + 'px';
  }

  if (optionLeft && (udpateOption === 'left' || !udpateOption)) {
    // calc position option left
    const optionLeftHeightContent: HTMLDivElement = optionLeft.querySelector(
      '.uid-dropdown-content-in-table-option',
    );

    const optionLeftHeight = optionLeftHeightContent.offsetHeight;

    optionLeft.style.top = docYCellInTable + 'px';
    optionLeft.style.left = '0px';

    const dropdownContent = optionLeft.querySelector(
      '.uid-dropdown-content-in-table-option',
    ) as HTMLDivElement;
    dropdownContent.style.top = (cellHeight - optionLeftHeight) / 2 + 'px';

    // calc position option left line
    const optionLeftLine = optionLeft.querySelector('.uid-option-line') as HTMLDivElement;
    optionLeftLine.style.height = cellHeight + 1 + 'px';
  }
};

// resize observer for change size in options of cell
export const resizeObserver = ({ contentRef, optionRowSelectIdRef, optionColumnSelectIdRef }) => {
  return new ResizeObserver(() => {
    if (!contentRef.current) {
      return;
    }

    const dropdownTopActive = contentRef.current
      .querySelector('.uid-table-option-top')
      .getAttribute('data-is-active');
    const dropdownLeftActive = contentRef.current
      .querySelector('.uid-table-option-left')
      .getAttribute('data-is-active');

    let udpateOption = undefined;

    if (!dropdownTopActive || dropdownTopActive === 'true') {
      // resize active dropdown (top)
      udpateOption = 'top';
    } else if (!dropdownLeftActive || dropdownLeftActive === 'true') {
      // resize active dropdown (left)
      udpateOption = 'left';
    }

    chagenOptionCellPositon({
      rowId: optionRowSelectIdRef.current,
      columnId: optionColumnSelectIdRef.current,
      contentRef,
      udpateOption,
    });
  });
};

// helper column
export const insertColumn = ({ columnId, cellData, cellToAdd, contentRef, typeInsert }) => {
  // declare vars
  const cellDataCopy = [...cellData];

  // get index column
  const currentColumnIndex = cellDataCopy[0].findIndex((cell) => {
    return cell.columnId == columnId;
  });

  let insertIndex = null;
  if (typeInsert === 'right') {
    insertIndex = currentColumnIndex + 1;
  } else if (typeInsert === 'left') {
    insertIndex = currentColumnIndex;
  } else if (typeInsert === 'clone') {
    insertIndex = currentColumnIndex + 1;
  }

  // create new row
  const newColumns = [];

  const columnIds = cellData[0].map((subList) => subList.columnId);

  const columnNewId = idNew({ array: columnIds });

  cellDataCopy.forEach((row) => {
    const rowId = row[0].rowId;

    let cellNew;
    if (typeInsert === 'clone') {
      cellNew = _.cloneDeep(row[currentColumnIndex]);

      const refCellInput = getCellElement({ contentRef, rowId, columnId });

      const inputValue = getValueInputFromCell({ refCellInput });

      cellNew['defaultValue'] = inputValue;
    } else if (cellToAdd) {
      cellNew = { ...cellToAdd };
    } else {
      cellNew = _.cloneDeep(row[currentColumnIndex]);

      for (const prop in cellNew.removeDataInAggregation) {
        const thisData = cellNew.removeDataInAggregation[prop];

        cellNew[prop] = thisData;
      }
    }

    cellNew.rowId = rowId;
    cellNew.columnId = columnNewId;

    newColumns.push(cellNew);

    row.splice(insertIndex, 0, cellNew);
  });

  // insert in cell data

  return [cellDataCopy, newColumns];
};

export const columnRemove = ({ columnId, cellData }) => {
  const cellDataCopy = _.cloneDeep(cellData);
  const removeColumn = [];

  cellData.forEach((row, index) => {
    cellDataCopy[index] = row.filter((cell) => {
      const isValid = cell.columnId != columnId;

      if (!isValid) {
        removeColumn.push(_.cloneDeep(cell));
      }

      return isValid;
    });
  });

  return [cellDataCopy, removeColumn];
};

// helper row
export const insertRow = ({ rowId, cellData, cellToAdd, typeInsert, contentRef }) => {
  // declarate vars
  const cellDataCopy = [...cellData];

  // get index row
  const currentRowIndex = cellDataCopy.findIndex((row) => row[0].rowId == rowId);

  // create new row
  const newRow = [];

  const rowIds = cellDataCopy.map((subList) => subList[0].rowId);

  const rowIdNew = idNew({ array: rowIds });

  cellDataCopy[currentRowIndex].forEach((cell, index) => {
    let cellNew: any;
    const columnId = cell.columnId;

    if (typeInsert === 'clone') {
      const cellCurrent = cellDataCopy[currentRowIndex][index];

      cellNew = _.cloneDeep(cellCurrent);

      const refCellInput = getCellElement({ contentRef, rowId, columnId });

      const inputValue = getValueInputFromCell({ refCellInput });

      cellNew['defaultValue'] = inputValue;
    } else if (cellToAdd) {
      cellNew = { ...cellToAdd };
    } else {
      const cellCurrent = cellDataCopy[currentRowIndex][index];

      cellNew = _.cloneDeep(cellCurrent);

      for (const prop in cellNew.removeDataInAggregation) {
        const thisData = cellNew.removeDataInAggregation[prop];

        cellNew[prop] = thisData;
      }
    }
    cellNew['columnId'] = columnId;
    cellNew['rowId'] = rowIdNew;

    newRow.push(cellNew);
  });

  // insert in cell data
  let insertIndex = null;
  if (typeInsert === 'top') {
    insertIndex = currentRowIndex;
  } else if (typeInsert === 'down') {
    insertIndex = currentRowIndex + 1;
  } else if (typeInsert === 'clone') {
    insertIndex = currentRowIndex + 1;
  }

  cellDataCopy.splice(insertIndex, 0, newRow);

  return [cellDataCopy, newRow];
};

export const rowRemove = ({ rowId, cellData }) => {
  let tableDataCopy = [...cellData];
  let removeRow = [];

  tableDataCopy = tableDataCopy.filter((row) => {
    const cell = row[0];
    const isValid = cell.rowId !== rowId;
    console.log(cell);

    if (!isValid) {
      removeRow = row;
    }

    return isValid;
  });

  return [tableDataCopy, removeRow];
};

// helper cell
export const getCellElement = ({ rowId, columnId, contentRef }) =>
  contentRef.current.querySelector(`[data-ui-row-id="${rowId}"] [data-ui-column-id="${columnId}"]`);

export const cellExport = ({
  rowId,
  columnId,
  contentRef,
  setHoverTable,
  optionRowSelectIdRef,
  optionColumnSelectIdRef,
}) => {
  return {
    onMouseLeave: () => {
      setHoverTable(false);
    },
    onMouseEnter: (event) => {
      setHoverTable(true);

      // get id cell
      let tableCellDom = event.target;

      while (!tableCellDom.classList.contains('uid-interactive-table-cell')) {
        tableCellDom = tableCellDom.parentNode;
      }

      // add resize observer
      const cellsDom = contentRef.current.querySelectorAll(
        `.uid-interactive-table-row[data-ui-row-id="${rowId}"] .uid-interactive-table-celll`,
      );

      cellsDom.forEach((cellDom) => {
        const activeResizeObserver = cellDom.getAttribute('uid-active-resize-observer');

        if (!activeResizeObserver || activeResizeObserver === 'false') {
          cellDom.setAttribute('uid-active-resize-observer', 'true');
          const getResizeObserver = resizeObserver({
            contentRef,
            optionRowSelectIdRef,
            optionColumnSelectIdRef,
          });

          getResizeObserver.observe(cellDom);
        }
      });

      // Update option cell positon
      const dropdownTopActive = contentRef.current
        .querySelector('.uid-table-option-top')
        ?.getAttribute('data-is-active');
      const dropdownLeftActive = contentRef.current
        .querySelector('.uid-table-option-left')
        ?.getAttribute('data-is-active');

      if (
        (dropdownTopActive && dropdownTopActive === 'true') ||
        (dropdownLeftActive && dropdownLeftActive === 'true')
      ) {
        // dropdown is active
        return;
      }

      chagenOptionCellPositon({ rowId, columnId, contentRef });
      optionRowSelectIdRef.current = rowId;
      optionColumnSelectIdRef.current = columnId;
    },
  };
};

export const getValueInputFromCell = ({ refCellInput }) => {
  let inputValue = '';

  // get data input
  const textInput = refCellInput.querySelector('input');
  if (textInput) {
    inputValue = textInput.value;
  }

  // get data code input
  const codeInput = refCellInput.querySelector('.cm-editor .cm-line');
  const placeholderCodeInput = refCellInput.querySelector('.cm-editor .cm-line .cm-placeholder');

  if (codeInput && !placeholderCodeInput) {
    inputValue = codeInput.textContent;
  }

  return inputValue;
};

// reducer
export const reducerDropdownState = (state, action) => {
  switch (action.axis) {
    case 'left':
      return {
        dropdown: {
          isOpen: true,
          axis: 'left',
        },
      };
    case 'top':
      return {
        dropdown: {
          isOpen: true,
          axis: 'top',
        },
      };
    default:
      return {
        dropdown: {
          isOpen: false,
          axis: undefined,
        },
      };
  }
};

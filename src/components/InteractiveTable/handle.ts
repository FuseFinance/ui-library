import { newIdFromKey } from '@utils/array';

export const handleInsertTopExport = (currentRowId, tableData, defaultAddInRow) => {
    const newTableData = [...tableData];

    const newDefaultAddInRow = {...defaultAddInRow};

    const insertIndex = newTableData.findIndex(element => element.key == currentRowId);

    newDefaultAddInRow.key = newIdFromKey({array: newTableData});        

    newTableData.splice(insertIndex, 0, newDefaultAddInRow);

    return [newTableData, newDefaultAddInRow]      
}

export const handleInsertDownExport = (currentRowId, tableData, defaultAddInRow) => {
    const newTableData = [...tableData];

    const newDefaultAddInRow = {...defaultAddInRow};

    const insertIndex = newTableData.findIndex(element => element.key == currentRowId);

    newDefaultAddInRow.key = newIdFromKey({array: newTableData});

    newTableData.splice((insertIndex + 1), 0, newDefaultAddInRow);

    return [newTableData, newDefaultAddInRow];   
}

export const handleDuplicateExport = (currentRowId, tableData, tableColumns, contentRef) => {

    const newTableData = [...tableData];

    const insertIndex = newTableData.findIndex(element => element.key == currentRowId);

    const currentData = JSON.parse(JSON.stringify(newTableData[insertIndex]));

    // update data input 
    tableColumns.forEach((column, columnIndex) => {
        const columnId = columnIndex + 1;
        const columnClassList = column.className.split(' ');
        columnClassList.forEach(columnClass => {
            if(columnClass === "input-type-cell"){

                if(contentRef.current){
                    const cellInput = contentRef.current.querySelector(`.ant-table-row[data-row-key="${currentRowId}"] .ant-table-cell:nth-child(${columnId})`)
                    let inputValue = "";

                    // get data input
                    const textInput = cellInput.querySelector('input')
                    if(textInput){
                        inputValue = textInput.value
                    }

                    // get data code input
                    const codeInput = cellInput.querySelector('.cm-editor .cm-line')
                    const placeholderCodeInput = cellInput.querySelector('.cm-editor .cm-line .cm-placeholder')

                    if(codeInput && !placeholderCodeInput){
                        inputValue = codeInput.textContent
                    }

                    currentData[column.dataIndex].defaultValue = inputValue
                }

            }
        });
    });

    // duplicate data
    currentData.key = newIdFromKey({array: newTableData});    

    newTableData.splice(insertIndex, 0, currentData);

    return [newTableData, currentData];
}

export const handleRemoveExport = (idOptionRow, tableData) => {

    let newTableData = [...tableData];

    newTableData = newTableData.filter(objeto => objeto.key !== idOptionRow);

    return newTableData

}
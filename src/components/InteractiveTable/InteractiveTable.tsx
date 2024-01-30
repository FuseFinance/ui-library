import { Table, Dropdown } from 'antd';
import {TypeInputTableSimple} from './type';
import { useState, useEffect, useRef } from 'react';
import './InteractiveTable.css';
import color from '@/src/styles/colorsGlobal';
import Icon from '@/src/components/Icons';
import { IconList } from '@/src/components/Icons/types';
import { handleInsertTopExport, handleInsertDownExport, handleDuplicateExport, handleRemoveExport } from './handle'

const InteractiveTable = ({
    initTableData,
    initTableColumns,
    defaultAddInRow,
    onAddRow,
    onRemoveRow,
    customAttrAddRow,
    canEdit = true,
    canAddRows = false,
    canAddColumn = false
} : TypeInputTableSimple ) => {

    // use state
    const [tableData, setTableData] = useState<(Record<string, any>)[]>()
    const [tableColumns, setTableColumns] = useState<(Record<string, any>)[]>()
    const [hoverTalbe, setHoverTable] = useState<boolean>(null)
    const [activeOptionLeft, setActiveOptionLeft] = useState<boolean>(false)
    const [idOptionRow, setIdOptionRow] = useState<number>(null)

    // content ref 
    const contentRef = useRef<HTMLDivElement>(null);
    const optionTop = useRef<HTMLDivElement>(null);
    const optionLeft = useRef<HTMLDivElement>(null);
    const miRef = useRef<number>(null);

    // chagen positon of option cell
    const chagenOptionCellPositon = ({idRow} : {idRow: number}) => {

        // get data cell
        const rowElement = contentRef.current.querySelector(`.ant-table-row[data-row-key="${idRow}"]`);
        
        const rowHeight = (rowElement as HTMLElement).offsetHeight;
                
        // get table position
        const rectTable = contentRef.current.getBoundingClientRect();
        const docXTable = rectTable.left;
        const docYTable = rectTable.top;

        // get cell position
        const rectCell = rowElement.getBoundingClientRect();
        const docXCellInTable = rectCell.left - docXTable;
        const docYCellInTable = rectCell.top - docYTable;

        // change coordinates
        if(
            optionTop.current
        ){
            optionTop.current.style.top = docYTable + "px";
            optionTop.current.style.left = docXCellInTable + "px";
        }

        if(
            optionLeft.current    
        ){
            optionLeft.current.style.top = (docYCellInTable) + "px";
            optionLeft.current.style.left = "0px";

            const optionLine = optionLeft.current.querySelector(".uid-option-line") as HTMLDivElement; 
            optionLine.style.height = rowHeight + "px";

            const dropdownContent = optionLeft.current.querySelector(".uid-dropdown-content-in-table-option") as HTMLDivElement; 
            dropdownContent.style.top = ((rowHeight / 2) - 12) + "px";
        }

        miRef.current = idRow;
        setIdOptionRow(idRow)

    }
    
    // resize observer for change size in options of cell
    const resizeObserver = new ResizeObserver(() => {
        const dataIsActive = contentRef.current.querySelector(".uid-table-option-left").getAttribute("data-is-active");
        
        if(!dataIsActive || dataIsActive === "false"){
            return
        }        
        chagenOptionCellPositon({idRow: miRef.current})
    });

    // table option events
    const onCell = (rowData) => {

        const rowElement = contentRef.current.querySelectorAll(`.ant-table-row[data-row-key="${rowData.key}"] .ant-table-cell`);
        
        rowElement.forEach(element => {

            const activeResizeObserver = element.getAttribute('uid-active-resize-observer');

            if(activeResizeObserver || activeResizeObserver === "false"){
                return;
            }

            element.setAttribute('uid-active-resize-observer', 'true');

            resizeObserver.observe(element);            
        });

        return {
            onMouseLeave: () => {
                setHoverTable(false)
            },
            onMouseEnter: () => { 
                setHoverTable(true)

                const dataIsActive = contentRef.current.querySelector(".uid-table-option-left").getAttribute("data-is-active");
        
                if(dataIsActive && dataIsActive === "true"){
                    return
                }

                chagenOptionCellPositon({idRow : rowData.key})

            },
        };
    }

    // Add trash
    useEffect(() => {

        const newTableColumns = [...initTableColumns];
        const newTableData = [...initTableData];

        newTableColumns.forEach(element => {
            element.onCell = onCell;
        });

        setTableColumns(newTableColumns);
        setTableData(newTableData);


    }, []);


    // handle
    const handleDropdownLeft = (isActive) => {

        setActiveOptionLeft(isActive)

    } 
  
    // handle dropdown
    const handleInsertTop = (currentRowId, tableData, defaultAddInRow) => {
        const [newTableData, newRow] = handleInsertTopExport(currentRowId, tableData, defaultAddInRow);

        setTableData(newTableData);

        if(onAddRow){
            onAddRow(newTableData, newRow);
        }        
    }

    const handleInsertDown = (currentRowId, tableData, defaultAddInRow) => {
        
        const [newTableData, newRow] = handleInsertDownExport(currentRowId, tableData, defaultAddInRow);

        setTableData(newTableData);

        if(onAddRow){
            onAddRow(newTableData, newRow);
        }        
    }

    const handleDuplicate = (currentRowId, tableData, tableColumns, contentRef) => {

        const [newTableData, newRow] =  handleDuplicateExport(currentRowId, tableData, tableColumns, contentRef)

        setTableData(newTableData);

        if(onAddRow){
            onAddRow(newTableData, newRow);
        }
    }

    const handleRemove = (idOptionRow, tableData) => {

        if(tableData.length > 1){
            const newTableData = handleRemoveExport(idOptionRow, tableData);

            setTableData(newTableData);

            if(onRemoveRow){
                onRemoveRow(newTableData)
            }
        }
    }

    // option dropdown
    const items = [
        {
            key: '1',
            label: 'Insert up',
            onClick: () => handleInsertTop(idOptionRow, tableData, defaultAddInRow),
            icon: <Icon icon={IconList.UpArrow} cursor="pointer" width="20px" height="20px" onClick={console.log} /> ,
        },
        {
            key: '2',
            label: 'Insert down',
            onClick: () => handleInsertDown(idOptionRow, tableData, defaultAddInRow),
            icon: <Icon icon={IconList.DownArrow} cursor="pointer" width="20px" height="20px" onClick={console.log} /> ,
        },
        {
            key: '3',
            label: 'Duplicate',
            onClick: () => handleDuplicate(idOptionRow, tableData, tableColumns, contentRef),
            icon: <Icon icon={IconList.Copy} cursor="pointer" width="20px" height="15px" onClick={console.log} /> ,
        },
        {
            key: '4',
            label: 'Delete',
            onClick: () => handleRemove(idOptionRow, tableData),
            icon: <Icon icon={IconList.Trash} cursor="pointer" width="20px" height="16px" onClick={console.log} /> ,
        }        
    ];

    return (<div ref={contentRef} className={`uid-interactive-table ${hoverTalbe && "hover-table"}` }>
        <Table 
        showHeader={false} pagination={false} dataSource={tableData} columns={tableColumns}/>
        {canAddColumn && <div ref={optionTop} data-is-active="false" className='uid-table-option uid-table-option-top'>
            a (canAddColumn)
        </div>}
        {canAddRows && <div ref={optionLeft} data-is-active={activeOptionLeft} className={`uid-table-option uid-table-option-left`}>
            <div className='uid-dropdown-content-in-table-option z-10'>
                <Dropdown
                    trigger={['click']}
                    menu={{
                    items,
                    }}
                    onOpenChange={handleDropdownLeft}
                    placement={"rightTop" as any}
                >
                    <div className='bg-gray-300 rounded'>
                        <Icon icon={IconList.MenuVertiacal} cursor="pointer" width="13px" height="1.4rem" />
                    </div>
                </Dropdown> 
            </div>
            <div className='uid-option-line'></div>
        </div>
        }   
        {
        canEdit && canAddRows && <div className='add-bottom-row absolute w-full pt-0.9 pb-1'>
            <div className='bg-gray-200 w-full rounded flex justify-center p-0.9' role='button' onKeyDown={() => {handleInsertDown(tableData[tableData.length - 1].key, tableData, defaultAddInRow)}} tabIndex={0} onClick={() => {handleInsertDown(tableData[tableData.length - 1].key, tableData, defaultAddInRow)}} {...customAttrAddRow}> 
                <Icon icon={IconList.Plus} fill={color.gray[400]} cursor="pointer" width="8px" height="8px" />
            </div>
        </div>
        }
    </div>);
}

export default InteractiveTable; 
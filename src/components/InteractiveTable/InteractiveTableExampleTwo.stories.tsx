import { Meta } from '@storybook/react';
import { Input, Button } from 'antd';
import { InteractiveTable } from '@/src/components/InteractiveTable';
import { useState } from 'react';

export default {
  title: 'Form/InteractiveTable',
  component: InteractiveTable
} as Meta;

const Template = (args) => {
  
  // set state
  const [cellData, setCellData] = useState(args.initCellData);
  const [tableColumns, setTableColumns] = useState(args.columns);

  // handle
  const handleAddHeaderTop = () => {
    setCellData([[
      {
        columnId: 1,
        rowId: 4,
        defaultValue: "",
        placeholder: "",
        type: 'input-cell',
        render: (data) => {
          return(
          <Input defaultValue={data.defaultValue} placeholder={data.placeholder} />
        )},
      },
      {
        columnId: 2,
        rowId: 4,
        defaultValue: "",
        placeholder: "",          
        type: 'input-cell',
        render: (data) => {
          return(
          <Input defaultValue={data.defaultValue} placeholder={data.placeholder} />
        )},
      },
      {
        columnId: 3,
        rowId: 4,
        defaultValue: "",
        placeholder: "",          
        type: 'input-cell',
        render: (data) => {
          return(
          <Input defaultValue={data.defaultValue} placeholder={data.placeholder} />
        )},
      },
    ], ...cellData])
  }

  const handleAddHeaderLeft = () => {

    const tableColumnsCopy = [...tableColumns];

    tableColumnsCopy.splice(0, 0, {
      dataIndex: 'inputInput',
      key: 4,
      className: 'input-type-cell data-id-1',
      render: (data) => {
        return(
        <Input defaultValue={data.defaultValue} placeholder={data.placeholder} />
      )},
    });

    setTableColumns(tableColumnsCopy);
  }

  // const handleNewRow = (allTableData, newRow) => {
  //   console.log("---------------")
  //   console.log(allTableData)
  //   console.log(newRow)
  //   console.log("---------------")

  //   setTableData(allTableData)
  // }

  // const handleNewColumn = (allTableColumns, newColumn) => {
  //   console.log("---------------")
  //   console.log(allTableColumns)
  //   console.log(newColumn)
  //   console.log("---------------")

  //   setTableColumns(allTableColumns)
  // }

  // const handleRowRemove = (allTableData, removeRow) => {
  //   console.log("--------------- handle")
  //   console.log(allTableData)
  //   console.log(removeRow)
  //   console.log("---------------")

  //   setTableData(allTableData)
  // }

  // const handleColumnRemove = (allTableData, removeColumn) => {
  //   console.log("--------------- handle")
  //   console.log(allTableData)
  //   console.log(removeColumn)
  //   console.log("---------------")

  //   setTableData(allTableData)
  // }

  return (<div>

    <InteractiveTable 
      // onAddColumn={handleNewColumn}
      // onAddRow={handleNewRow}
      // onColumnRemove={handleColumnRemove}
      // onRowRemove={handleRowRemove}
      cellToAdd={args.cellToAdd}
      canAddRows={args.canAddRows}
      canAddColumn={args.canAddColumn}
      value={cellData}
    />

    <div className='mt-6'>
      <Button onClick={handleAddHeaderTop}>top</Button>
      <Button onClick={handleAddHeaderLeft}>left</Button>
    </div>
  </div>)
};

export const InteractiveTableExampleTwo = Template.bind({});
InteractiveTableExampleTwo.args = {
  cellToAdd: {
    type: 'input-cell',
    defaultValue: "",
    placeholder: "",    
    render: (data) => {
      return(
      <Input defaultValue={data.defaultValue} placeholder={data.placeholder} />
    )},
  },    
  canAddRows : true,
  canAddColumn: true,
  initCellData : [
    [
      {
        columnId: 1,
        rowId: 1,
        defaultValue: "",
        placeholder: "",
        type: 'input-cell',
        render: (data) => {
          return(
          <Input defaultValue={data.defaultValue} placeholder={data.placeholder} />
        )},
      },
      {
        columnId: 2,
        rowId: 1,
        defaultValue: "",
        placeholder: "",          
        type: 'input-cell',
        render: (data) => {
          return(
          <Input defaultValue={data.defaultValue} placeholder={data.placeholder} />
        )},
      },
      {
        columnId: 3,
        rowId: 1,
        defaultValue: "",
        placeholder: "",          
        type: 'input-cell',
        render: (data) => {
          return(
          <Input defaultValue={data.defaultValue} placeholder={data.placeholder} />
        )},
      },
    ],
    [
      {
        columnId: 1,
        rowId: 2,
        defaultValue: "",
        placeholder: "",          
        type: 'input-cell',
        render: (data) => {
          return(
          <Input defaultValue={data.defaultValue} placeholder={data.placeholder} />
        )},
      },

      {
        columnId: 2,
        rowId: 2,
        defaultValue: "",
        placeholder: "",          
        type: 'input-cell',
        render: (data) => {
          return(
          <Input defaultValue={data.defaultValue} placeholder={data.placeholder} />
        )},
      },

      {
        columnId: 3,
        rowId: 2,
        defaultValue: "",
        placeholder: "",          
        type: 'input-cell',
        render: (data) => {
          return(
          <Input defaultValue={data.defaultValue} placeholder={data.placeholder} />
        )},
      },
    ],
    [
      {
        columnId: 1,
        rowId: 3,
        defaultValue: "",
        placeholder: "",          
        type: 'input-cell',
        render: (data) => {
          return(
          <Input defaultValue={data.defaultValue} placeholder={data.placeholder} />
        )},
      },

      {
        columnId: 2,
        rowId: 3,
        defaultValue: "",
        placeholder: "",          
        type: 'input-cell',
        render: (data) => {
          return(
          <Input defaultValue={data.defaultValue} placeholder={data.placeholder} />
        )},
      },

      {
        columnId: 3,
        rowId: 3,
        defaultValue: "",
        placeholder: "",          
        type: 'input-cell',
        render: (data) => {
          return(
          <Input defaultValue={data.defaultValue} placeholder={data.placeholder} />
        )},
      },
    ],
  ]
};
import { Meta } from '@storybook/react';
import { Input } from 'antd';
import { InteractiveTable } from '@/src/components/InteractiveTable';
import { BaseCodeEditor } from '@components/BaseCodeEditor';

export default {
  title: 'Form/InteractiveTable',
  component: InteractiveTable
} as Meta;

const Template = (args) => {


  return (
    <>
      <InteractiveTable canAddRows={args.canAddRows} defaultAddInRow={args.defaultAddInRow} initTableData={args.data} initTableColumns={args.columns}>
      </InteractiveTable>
    </>
  );
};

export const InteractiveTableExample = Template.bind({});
InteractiveTableExample.args = {
  defaultAddInRow: {
    inputInput: {
      defaultValue: "new",
      placeholder: "key"
    },        
    inputCode: {
      defaultValue: "",
      placeholder: "value"
    },
    inputCodeWithText: {
      defaultValue: "",
      placeholder: "value"
    },
  },
  canAddRows : true,
  data: [
    {
      key: 1,
      inputInput: {
        defaultValue: "my input",
        placeholder: "key"
      },        
      inputCode: {
        defaultValue: "",
        placeholder: "value"
      },
      inputCodeWithText: {
        defaultValue: "",
        placeholder: "value"
      },
    },
    {
      key: 2,
      inputInput: {
        defaultValue: "",
        placeholder: "key"
      },        
      inputCode: {
        defaultValue: "",
        placeholder: "value"
      },
      inputCodeWithText: {
        defaultValue: "var myVar = customVars.myOpntionOne()",
        placeholder: "value"
      },      
    },
    {
      key: 3,
      inputInput: {
        defaultValue: "my input two",
        placeholder: "key"
      }, 
      inputCode: {
        defaultValue: "var myVar = customVars.myOpntionOne()",
        placeholder: "value"
      },
      inputCodeWithText: {
        defaultValue: "",
        placeholder: "value"
      },      
    },
    {
      key: 4,
      inputInput: {
        defaultValue: "",
        placeholder: "key"
      }, 
      inputCode: {
        defaultValue: "",
        placeholder: "value"
      },
      inputCodeWithText: {
        defaultValue: "var myVar = customVars.myOpntionOne()",
        placeholder: "value"
      },      
    },    
  ],
  columns : [
    {
      dataIndex: 'inputInput',
      key: 'inputInput',
      width: '40%',
      className: 'input-type-cell',
      render: (data) => {
        return(
        <Input defaultValue={data.defaultValue} placeholder={data.placeholder} />
      )},
    },
    {
      dataIndex: 'inputCode',
      key: 'inputCode',
      className: 'input-type-cell',
      width: '40%',
      render: (data) => (
        <BaseCodeEditor maxLines={1} defaultValue={data.defaultValue} onChange={console.log} customCSSClass="" placeholder={data.placeholder} plugins={[{ "name": "customVars", "isModule": true, "decorationClass": "code-tag code-editor-hl-formula", "options": { "myOpntionOne()": "customVars" }, "matchRegex": /customVars\.(myOpntionOne())\b\((.*?)\)/g }]} />
      ),
    },
    {
      dataIndex: 'inputCodeWithText',
      key: 'inputCodeWithText',
      className: 'input-type-cell',
      width: '20%',
      render: (data) => (
        <BaseCodeEditor defaultValue={data.defaultValue} onChange={console.log} customCSSClass="" placeholder={data.placeholder} plugins={[{ "name": "customVars", "isModule": true, "decorationClass": "code-tag code-editor-hl-formula", "options": { "myOpntionOne()": "customVars" }, "matchRegex": /customVars\.(myOpntionOne())\b\((.*?)\)/g }]} />
      ),
    },
  ]
};
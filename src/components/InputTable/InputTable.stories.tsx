import { Meta } from '@storybook/react';
import { Table, Input } from 'antd';
import { BaseCodeEditor } from '@components/BaseCodeEditor';

export default {
  title: 'Form/Table',
  component: Table
} as Meta;

const Template = (args) => {

  return (
    <>
      <Table showHeader={false} pagination={false} dataSource={args.data} columns={args.columns}>
      </Table>

    </>
  );
};

export const InputTable = Template.bind({});
InputTable.args = {
  data: [
    {
      key: '1',
      inputInput: {
        defaultValue: "my input",
        placeholder: "key"
      },        
      inputCode: {
        defaultValue: undefined,
        placeholder: "value"
      },
      inputCodeWithText: {
        defaultValue: undefined,
        placeholder: "value"
      },
    },
    {
      key: '2',
      inputInput: {
        defaultValue: undefined,
        placeholder: "key"
      },        
      inputCode: {
        defaultValue: undefined,
        placeholder: "value"
      },
      inputCodeWithText: {
        defaultValue: "var myVar = customVars.myOpntionOne()",
        placeholder: "value"
      },      
    },
    {
      key: '3',
      inputInput: {
        defaultValue: "my input two",
        placeholder: "key"
      }, 
      inputCode: {
        defaultValue: "var myVar = customVars.myOpntionOne()",
        placeholder: "value"
      },
      inputCodeWithText: {
        defaultValue: undefined,
        placeholder: "value"
      },      
    },
    {
      key: '4',
      inputInput: {
        defaultValue: undefined,
        placeholder: "key"
      }, 
      inputCode: {
        defaultValue: undefined,
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
      render: (data) => (
        <Input defaultValue={data.defaultValue} placeholder={data.placeholder} />
      ),
    },
    {
      dataIndex: 'inputCode',
      key: 'inputCode',
      className: 'input-type-cell',
      width: '40%',
      render: (data) => (
        <BaseCodeEditor defaultValue={data.defaultValue} onChange={console.log} customCSSClass="" placeholder={data.placeholder} plugins={[{ "name": "customVars", "isModule": true, "decorationClass": "code-tag code-editor-hl-formula", "options": { "myOpntionOne()": "customVars" }, "matchRegex": /customVars\.(myOpntionOne())\b\((.*?)\)/g }]} />
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
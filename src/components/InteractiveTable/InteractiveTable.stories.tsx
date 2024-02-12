import { Meta } from '@storybook/react';
import { Input } from 'antd';
import { InteractiveTable } from '@/src/components/InteractiveTable';
import { BaseCodeEditor } from '@components/BaseCodeEditor';
import { javascript } from '@codemirror/lang-javascript';
import Icon from '@/src/components/Icons';
import { IconList } from '@/src/components/Icons/types';
import { colors } from '@styles/index';

export default {
  title: 'Form/InteractiveTable',
  component: InteractiveTable
} as Meta;

const Template = (args) => <InteractiveTable canAddRows={args.canAddRows} defaultAddInRow={args.defaultAddInRow} initTableData={args.data} initTableColumns={args.columns}/>;

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
        <BaseCodeEditor positionCenterContentAfter='center' contentAfter={<Icon className='mr-2' icon={IconList.ArrowRight} fill={colors.gray[400]} width="11px" height="12px" onClick={console.log} />} maxLines={1} maxHeightLines={4.5} resizingAboveElements={true} lineWrapping={true} extensions={[javascript()]} defaultValue={data.defaultValue} onChange={console.log} customCSSClass="" placeholder={data.placeholder} plugins={[{ "name": "customVars", "isModule": true, "decorationClass": "code-tag code-editor-hl-formula", "options": { "myOpntionOne()": "customVars" }, "matchRegex": /customVars\.(myOpntionOne())\b\((.*?)\)/g }]} />
      ),
    },
    {
      dataIndex: 'inputCodeWithText',
      key: 'inputCodeWithText',
      className: 'input-type-cell',
      width: '20%',
      render: (data) => (
        <BaseCodeEditor maxLines={1} resizingAboveElements={true} lineWrapping={true} defaultValue={data.defaultValue} onChange={console.log} extensions={[javascript()]} customCSSClass="" placeholder={data.placeholder} plugins={[{ "name": "customVars", "isModule": true, "decorationClass": "code-tag code-editor-hl-formula", "options": { "myOpntionOne()": "customVars" }, "matchRegex": /customVars\.(myOpntionOne())\b\((.*?)\)/g }]} />
      ),
    },
  ]
};
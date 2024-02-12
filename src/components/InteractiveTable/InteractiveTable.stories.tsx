import { Meta } from '@storybook/react';
import { Input } from 'antd';
import { InteractiveTable } from '@/src/components/InteractiveTable';
import { BaseCodeEditor } from '@components/BaseCodeEditor';
import { javascript } from '@codemirror/lang-javascript';

export default {
  title: 'Form/InteractiveTable',
  component: InteractiveTable,
} as Meta;

const Template = (args) => <InteractiveTable {...args} />;

export const InteractiveTableExample = Template.bind({});
InteractiveTableExample.args = {
  cellToAdd: {
    type: 'input-cell',
    defaultValue: '',
    placeholder: '',
    render: (data) => {
      return <Input defaultValue="0" placeholder={data.placeholder} />;
    },
  },
  canAddRows: true,
  canAddColumn: true,
  defaultValue: [
    [
      {
        columnId: 1,
        rowId: 1,
        defaultValue: "var a = 'b'",
        placeholder: '',
        type: 'input-cell',
        removeDataInAggregation: {
          defaultValue: '',
        },
        render: (data) => {
          return (
            <BaseCodeEditor
              maxLines={1}
              lineWrapping={true}
              resizingAboveElements={true}
              defaultValue={data.defaultValue}
              onChange={console.log}
              customCSSClass=""
              placeholder={data.placeholder}
              extensions={[javascript()]}
              plugins={[
                {
                  name: 'customVars',
                  isModule: true,
                  decorationClass: 'code-tag code-editor-hl-formula',
                  options: { 'myOpntionOne()': 'customVars' },
                  matchRegex: /customVars\.(myOpntionOne())\b\((.*?)\)/g,
                },
              ]}
            />
          );
        },
      },
      {
        columnId: 2,
        rowId: 1,
        defaultValue: '',
        placeholder: '',
        type: 'input-cell',
        render: (data) => {
          return <Input defaultValue={data.defaultValue} placeholder={data.placeholder} />;
        },
      },
      {
        columnId: 3,
        rowId: 1,
        defaultValue: '',
        placeholder: '',
        type: 'input-cell',
        render: (data) => {
          return <Input defaultValue={data.defaultValue} placeholder={data.placeholder} />;
        },
      },
    ],
    [
      {
        columnId: 1,
        rowId: 2,
        defaultValue: '',
        placeholder: '',
        type: 'input-cell',
        render: (data) => {
          return <Input defaultValue={data.defaultValue} placeholder={data.placeholder} />;
        },
      },

      {
        columnId: 2,
        rowId: 2,
        defaultValue: '',
        placeholder: '',
        type: 'input-cell',
        render: (data) => {
          return <Input defaultValue={data.defaultValue} placeholder={data.placeholder} />;
        },
      },

      {
        columnId: 3,
        rowId: 2,
        defaultValue: '',
        placeholder: '',
        type: 'input-cell',
        render: (data) => {
          return <Input defaultValue={data.defaultValue} placeholder={data.placeholder} />;
        },
      },
    ],
    [
      {
        columnId: 1,
        rowId: 3,
        defaultValue: '',
        placeholder: '',
        type: 'input-cell',
        render: (data) => {
          return <Input defaultValue={data.defaultValue} placeholder={data.placeholder} />;
        },
      },

      {
        columnId: 2,
        rowId: 3,
        defaultValue: '',
        placeholder: '',
        type: 'input-cell',
        render: (data) => {
          return <Input defaultValue={data.defaultValue} placeholder={data.placeholder} />;
        },
      },

      {
        columnId: 3,
        rowId: 3,
        defaultValue: '',
        placeholder: '',
        type: 'input-cell',
        render: (data) => {
          return <Input defaultValue={data.defaultValue} placeholder={data.placeholder} />;
        },
      },
    ],
  ],
};

import { Meta } from '@storybook/react';
import CodeEditor from './codeEditor';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/FormAndInput',
  component: CodeEditor,
  argTypes: {
    defaultValue: { control: 'text' },
    customCSSClass: { control: 'text' },
  },
} as Meta;

const Template = (args) => <CodeEditor {...args} />;

const handleChange = (e) => {
  action('change input')(e);
};

export const CodeEditorTextArea = Template.bind({});
CodeEditorTextArea.args = {
  defaultValue: '{}',
  onChange: handleChange,
  customCSSClass: 'h-96 w-full !bg-white',
};



export const CodeEditorInLine = Template.bind({});
CodeEditorInLine.args = {
  defaultValue: '{}',
  onChange: handleChange,
  customCSSClass: "var myVar = 'test'",
};
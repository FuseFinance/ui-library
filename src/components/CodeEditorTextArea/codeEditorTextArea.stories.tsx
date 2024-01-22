import { Meta } from '@storybook/react';
import { CodeEditorTextArea } from './';
import { action } from '@storybook/addon-actions';

export default {
  title: 'From/CodeEditorTextArea',
  component: CodeEditorTextArea,
  args:{
    defaultValue: undefined,
    placeholder:'my placeholder',
    plugins: [
      {
        "name": "customVars",
        "isModule": true,
        "decorationClass": "code-tag code-editor-hl-formula",
        "options": {
            "myOpntionOne()": "customVars"
        },
        "matchRegex": /customVars\.(myOpntionOne())\b\((.*?)\)/g
      }
    ],
    readonly: false,
    customCSSClass : undefined,
    containerCSSClass : undefined,
    customContainerAttr : undefined,
    minHeightLines : null,
    maxHeightLines : null
  },
  argTypes: {
    defaultValue: { 
      control: 'text', 
      defaultValue: undefined
    },
    customCSSClass: { control: 'text' },
    containerCSSClass: { control: 'text' },
    customContainerAttr: { control: 'object' },
    maxLines: { control: 'number', defaultValue: null, type: { name: 'number', required: false }, },
    minHeightLines: { control: 'number', defaultValue: null, type: { name: 'number', required: false }, },
    maxHeightLines: { control: 'number', defaultValue: null, type: { name: 'number', required: false }, }
  },
} as Meta;

const Template = (args) => <CodeEditorTextArea /* code use only in StoryBook */ 
  key={Date.now().toString() + Math.random().toString()} {...args} 
/>;

const handleChange = (e) => {
  action('change input')(e);
};

export const CodeEditorInLine = Template.bind({});
CodeEditorInLine.args = {
  defaultValue: "{\n\n}",
  onChange: handleChange,
  placeholder: "{}",  
};

import { Meta } from '@storybook/react';
import BaseCodeEditor from './baseCodeEditor';
import { action } from '@storybook/addon-actions';
import { javascript } from '@codemirror/lang-javascript';

export default {
  title: 'Form/CodeEditor',
  component: BaseCodeEditor,
  args:{
    defaultValue: undefined,
    placeholder:'my placeholder',
    readonly: false,
    customCSSClass : undefined,
    containerCSSClass : undefined,
    customContainerAttr : undefined
  },
  argTypes: {
    defaultValue: { 
      control: 'text', 
      defaultValue: undefined
    },
    customCSSClass: { control: 'text' },
    containerCSSClass: { control: 'text' },
    customContainerAttr: { control: 'object' },
    extensions: {
      table: {
        disable: true,
      },
    },    
  },
} as Meta;

const Template = (args) => <BaseCodeEditor /* code use only in StoryBook */ 
  key={Date.now().toString() + Math.random().toString()} {...args} 
/>;

const handleChange = (e) => {
  action('change input')(e);
};


export const CodeEditorInLine = Template.bind({});
CodeEditorInLine.args = {
  defaultValue: 'https://myweb.com/api/{{varName}}',
  onChange: handleChange,
  placeholder:'my placeholder', 
  maxLines: 1,
  plugins: [
    {
      "name": "interpolations",
      "isModule": true,
      "decorationClass": "code-tag code-editor-hl-interpolations",
      "options": {},
      "matchRegex": /\{\{\s*([^}}]*?)\s*\}\}/g
    }
  ],    
};

export const CodeEditorInLineWithJavascript = Template.bind({});
CodeEditorInLineWithJavascript.args = {
  defaultValue: 'var myVar = customVars.myOpntionOne();',
  onChange: handleChange,
  placeholder:'my placeholder', 
  maxLines: 1,
  extensions: [javascript()],
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
};

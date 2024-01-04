import EditableTitle from '@/src/components/EditableTitle/editableTitle';
import { IEditLabelProps, WithSize } from '@/src/components/EditableTitle/types';
import { action } from '@storybook/addon-actions';
import { Meta } from '@storybook/react';
import { StrongText } from '@/src/types/globalDesign/text';

const defaultArgs: IEditLabelProps & WithSize & StrongText = {
  label: 'Example',
  onLabelChange: (newValue) => action('edit text!')(newValue),
  canEdit: true,
  strongText: 'medium',
  $size: 'base',
  customAttrInput: undefined,
  customAttrText: undefined  
};

export default {
  title: 'From/EditableTitle',
  component: EditableTitle,
  args: defaultArgs,
  argTypes: {
    strongText: {
      control: 'select',
      options: ['medium', 'semibold'],
    },    
    $size: {
      control: 'select',
      options: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'],
    }
  },    
} as Meta;

const Template = (args) => <EditableTitle /* code use only in StoryBook */ 
key={Date.now().toString() + Math.random().toString()} {...args} />;

export const EditableTitleMain = Template.bind({});

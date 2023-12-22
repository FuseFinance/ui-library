import EditableText from '@components/EditableText/editableText';
import { IEditLabelProps, WithSize } from '@components/EditableText/types';
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
  title: 'Components/FormAndInput',
  component: EditableText,
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

const Template = (args) => <EditableText /* code use only in StoryBook */ 
key={Date.now().toString() + Math.random().toString()} {...args} />;

export const EditableTextMain = Template.bind({});

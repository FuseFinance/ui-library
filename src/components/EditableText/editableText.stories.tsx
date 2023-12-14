import EditableText from '@components/EditableText/editableText';
import { IEditLabelProps, WithSize } from '@components/EditableText/types';
import { action } from '@storybook/addon-actions';
import { Meta } from '@storybook/react';
import { StrongText } from '@/src/types/globalDesign/text';

const defaultArgs: IEditLabelProps & WithSize & StrongText = {
  label: 'Ejemplo',
  onLabelChange: (newValue) => action('edit text!')(newValue),
  canEdit: true,
  strongText: 'medium',
  $size: 'base'
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
      options: ['xs', 'sm', 'base', 'md', 'xl', '2xl', '3xl'],
    }
  },    
} as Meta;

const Template = (args) => <EditableText {...args} />;

export const EditableTextMain = Template.bind({});

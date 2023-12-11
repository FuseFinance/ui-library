import EditableText from '@components/EditableText/editableText';
import { IEditLabelProps, WithSize } from '@components/EditableText/types';
import { action } from '@storybook/addon-actions';
import { Meta } from '@storybook/react';

const defaultArgs: IEditLabelProps & WithSize = {
  label: 'Ejemplo',
  onLabelChange: (newValue) => action('edit text!')(newValue),
  canEdit: true,
};

export default {
  title: 'Components/FormAndInput',
  component: EditableText,
  args: defaultArgs
} as Meta;

const Template = (args) => <EditableText {...args} />;

export const EditableTextMain = Template.bind({});

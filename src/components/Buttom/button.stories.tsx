import { Meta } from '@storybook/react';
import { Button } from 'antd';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Button',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'middle', 'large'],
    },
    type: {
      control: 'select',
      options: ['primary', 'default', null], // Asume null como el valor para 'default'
    },
    disabled: {
      control: 'boolean',
    }
  },
} as Meta;

const Template = (args) => <Button {...args} />;

const handleButtonClick = (e) => {
  action('click in buttom')(e);
};

export const PrimaryButton = Template.bind({});
PrimaryButton.args = {
  type: 'primary',
  onClick:handleButtonClick
};

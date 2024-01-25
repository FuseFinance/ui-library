import { Meta, StoryObj } from '@storybook/react';
import { message } from 'antd';
import InputFields from './InputFields';

const meta: Meta<typeof InputFields> = {
  component: InputFields,
  title: 'Form/InputFields',
  // tags:['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const handleChange = (e) => {
  message.info(`${e.target.value}`);
};
export const Base: Story = {
  args: {
    handleOnChangeInput: handleChange,
  },
};

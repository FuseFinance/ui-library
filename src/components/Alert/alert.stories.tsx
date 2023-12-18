import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Space, Alert } from 'antd';
import { UilInfoCircle, UilCheckSquare } from '@iconscout/react-unicons';

export default {
  title: 'Components/Alert',
  component: Alert,
  args: {
    message: 'This is an alert message',
  },
  argTypes: {
    message: {
      control: 'text',
      defaultValue: 'This is an alert message',
    },
    type: {
      control: 'select',
      options: ['success', 'info', 'warning', 'error'],
    },
    // Add other prop definitions as needed
  },
} as Meta;

// Template for the Alert
const Template: Story = (args) => (
  <Space direction="vertical" style={{ width: '400px' }}>
    <Alert
      message={args.message}
      description="This is the alert description."
      type="error"
      style={{
        backgroundColor: 'white',
        border: 'none',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
      icon={args.icon}
      showIcon
    />
  </Space>
);

// Story with different configurations
export const SuccessAlert = Template.bind({});
SuccessAlert.args = {
  message: 'Information Text',
  type: 'success',
  icon: <UilInfoCircle style={{ color: 'blue' }} />,
};

export const CheckAlert = Template.bind({});
CheckAlert.args = {
  message: 'Check Information',
  type: 'info',
  icon: <UilCheckSquare style={{ color: 'green' }} />,
};

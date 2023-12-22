import React from 'react';
import { Meta } from '@storybook/react';
import { Dropdown, Button, Space, Menu, message } from 'antd';
import { DownOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Dropdown',
  component: Dropdown,
  args: {
    overlay: (
      <Menu>
        <Menu.Item key="1">Option 1</Menu.Item>
        <Menu.Item key="2">Option 2</Menu.Item>
        <Menu.Item key="3">Option 3</Menu.Item>
      </Menu>
    ),
  },
  argTypes: {
    disabled: { control: 'boolean' },
    overlay: { control: 'none' }, // Prevents overlay from being editable in the control panel
    // Add other prop definitions as needed
  },
} as Meta;

// Template for the Dropdown without icon
const TemplateWithoutIcon = (args) => (
  <Dropdown {...args}>
    <Button>
      <Space>
      Button
      <DownOutlined />
      </Space>
    </Button>    
  </Dropdown>
);

// Story with the Dropdown without icon
export const DropdownWithoutIcon = TemplateWithoutIcon.bind({});
DropdownWithoutIcon.args = {
  overlay: (
    <Menu onClick={(e) => {
        message.info('Action in console');
        action('menu item click')(e);
    } }>
      <Menu.Item key="1" icon={<UserOutlined />}>
        1st menu item
      </Menu.Item>
      <Menu.Item key="2" icon={<UserOutlined />}>
        2nd menu item
      </Menu.Item>
      <Menu.Item key="3" icon={<UserOutlined />} danger>
        3rd menu item
      </Menu.Item>
      <Menu.Item key="4" icon={<UserOutlined />} danger disabled>
        4rd menu item
      </Menu.Item>
    </Menu>
  ),
};

// Template for the Dropdown with icon
const TemplateWithIcon = (args) => (
  <Dropdown {...args}>
    <Button style={{ display: 'flex', alignItems: 'center' }}>
      <UserOutlined />
      <span style={{ marginTop: '2px' }}>User</span>
    </Button>
  </Dropdown>
);

// Story with the Dropdown with icon
export const DropdownWithIcon = TemplateWithIcon.bind({});
DropdownWithIcon.args = {
  overlay: (
    <Menu>
      <Menu.Item key="2" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Item key="3" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  ),
};
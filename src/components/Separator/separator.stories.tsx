
import { Meta } from '@storybook/react';
import { Divider } from 'antd';

export default {
  title: 'Components/Divider',
  component: Divider,
  args : {
    orientation:"",
    children : ""
  },
  argTypes: {
    orientation: {
        control: 'select',
        options: ['left', 'right', 'center'],
      },

  },
} as Meta;

const Template = (args) => <Divider {...args} />;

export const DividerMain = Template.bind({});
DividerMain.args = {
    orientation:"center",
    children : "test",
    style:{margin:0}
};


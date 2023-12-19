import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Tag } from 'antd';

export default {
  title: 'Components/Labels & Chips',
  component: Tag,
  args: {
    children: 'Label',
  },
  argTypes: {
    children: {
      control: 'text',
      defaultValue: 'Label',
    },
    color: {
      control: 'color',
      defaultValue: '#87d068',
    },
    closable: {
      control: 'boolean',
    },
    onClose: { action: 'closed' },
  },
} as Meta;

const __Labels: Story = (args) => (
  <div>
    <Tag style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', paddingLeft: '0.75rem', paddingRight: '0.75rem'  }} color="purple" {...args}></Tag>
    <Tag style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', paddingLeft: '0.75rem', paddingRight: '0.75rem'  }} color="green" {...args}></Tag>
    <Tag style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', paddingLeft: '0.75rem', paddingRight: '0.75rem'  }} color="yellow" {...args}></Tag>
    <Tag style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem', paddingLeft: '0.75rem', paddingRight: '0.75rem'  }} color="red" {...args}></Tag>
  </div>
);

const __Chips: Story = (args) => (
  <div>
    <Tag style={style.chip} color="purple" {...args}></Tag>
    <Tag style={style.chip} color="green" {...args}></Tag>
    <Tag style={style.chip} color="yellow" {...args}></Tag>
    <Tag style={style.chip} color="red" {...args}></Tag>
  </div>
);

const style = {
  chip: { 
    borderRadius: 25, 
    border: 'none', 
    paddingTop: '0.25rem', 
    paddingBottom: '0.25rem', 
    paddingLeft: '0.75rem', 
    paddingRight: '0.75rem' 
  },
};

export const Labels = __Labels.bind({});
Labels.args = {
  children: 'status chip',
};

export const Chips = __Chips.bind({});
Chips.args = {
  children: 'Multi Channels',
};

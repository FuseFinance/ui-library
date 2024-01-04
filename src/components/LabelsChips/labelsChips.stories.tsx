import React from 'react';
import { Meta } from '@storybook/react';
import { Tag } from 'antd';
import colors from '@styles/colorsGlobal';

export default {
  title: 'Components/Labels & Chips',
  component: Tag,
  args: {
    children: 'Label',
    color: colors.blue[600], 
    background: colors.blue[100]
  },
  argTypes: {
    children: {
      control: 'text',
      defaultValue: 'Label',
    },
    color: {
      control: 'color',
      defaultValue: colors.blue[600],
    },
    background: {
      control: 'color',
      defaultValue: colors.blue[100],
    }, 
    closable: {
      control: 'boolean',
    },
    onClose: { action: 'closed' },
  },
} as Meta;

const __Labels = (args) => (
  <div>
    <Tag className='pt-1 pb-1 pr-4 pl-4' style={{color: args.color, background: args.background, borderColor: args.color}}  onClose={args.onClose} closable={args.closable}>{args.children}</Tag>
  </div>
);

const __Chips = (args) => (
  <div>
    <Tag bordered={false} style={{color: args.color, background: args.background}} className='pt-1 pb-1 pr-2 pl-2 rounded-3xl' onClose={args.onClose} closable={args.closable} >{args.children}</Tag>
  </div>
);


export const Labels = __Labels.bind({});
Labels.args = {
  children: 'Status Labels',
};

export const Chips = __Chips.bind({});
Chips.args = {
  children: 'Status Chips',
};

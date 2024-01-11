import { Meta } from '@storybook/react';
import Text from './text';

export default {
  title: 'Components/Text',
  component: Text,
  args: {
    children: 'Lorem ipsum dolor sit amet',
  },
  argTypes: {
    size: {
      control: 'select',
      options: [
        'text-xs',
        'text-sm',
        'text-md',
        'text-lg',
        'text-xl',
        'text-2xl',
        'text-3xl',
        'text-4xl',
        'text-5xl',
      ],
    },
    strong: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
    },
  },
} as Meta;

const Template = (args) => <Text {...args} />;

export const SmallText = Template.bind({});
SmallText.args = {
  size: 'text-sm',
  strong: 'normal',
};

export const MediumText = Template.bind({});
MediumText.args = {
  size: 'text-md',
  strong: 'medium',
};

export const LargeBoldText = Template.bind({});
LargeBoldText.args = {
  size: 'text-lg',
  strong: 'bold',
};

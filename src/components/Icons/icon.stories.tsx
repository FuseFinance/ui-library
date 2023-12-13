import { Meta } from '@storybook/react';
import Icon from '@/src/components/Icons';
import { IconList } from '@/src/components/Icons/types';
import { action } from '@storybook/addon-actions';

const handleClick = (e) => {
  action('click in buttom')(e);
};

export default {
  title: 'Components/Icon',
  component: Icon,
  argTypes: {
    icon: {
      control: 'select',
      options: Object.values(IconList),
    },
    cursor: {
      control: 'select',
      options: ['pointer', undefined],
    },
    fill: {
      control: 'color'
    },    
  },
} as Meta;

const Template = (args) => <Icon {...args} />;

export const IcionPersonalized = Template.bind({});
IcionPersonalized.args = {
  testId:"my-id",
  icon:"Trash",
  fill:"#000",
  cursor:"pointer",
  width:"1.2rem",
  height:"1.4rem",
  onClick:{handleClick}
};

import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import StepModalHead from '@components/Modal/stepModalHead';
import { IconList } from '@/src/components/Icons/types';

export default {
  title: 'Components/Modal',
  component: StepModalHead,
  argTypes: {
    icon: {
      control: 'select',
      options: Object.values(IconList),
    }
  },  
} as Meta;

const onLabelChange = (e) => {
  action('On label change')(e);
}; 

const Template = (args) => <StepModalHead 
  {...args}

/>

export const StepModalHeadMain = Template.bind({});
StepModalHeadMain.args = {
  onLabelChange : onLabelChange,
  icon : 'Fx',
  label : 'test'
};

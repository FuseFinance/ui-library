import { Meta } from '@storybook/react';
import { message } from 'antd';
import FormElements from './FormElements';

const meta: Meta<typeof FormElements> = {
  component: FormElements,
  title: 'Form/FormElements',
  argTypes: {
    disabled: {
      control: 'boolean',
    }
  },
};

export default meta;

const onHandleClickCheck = () => {
  message.info('CheckBox Clicked!');
};

const onHandleChangeCheck = () => {
  message.info('CheckBox Checked!');
};

const onHandleClickRadio = () => {
  message.info('Radio Clicked!');
};

const onHandleChangeRadio = () => {
  message.info('Radio Checked!');
};

const onHandleClickSwitch = () => {
  message.info('Switch Clicked!');
};

const onHandleChangeSwitch = () => {
  message.info('Switch Changed!');
};
export const Base = {
  args: {
    handleOnClickCheck: onHandleClickCheck,
    handleOnChangeCheck: onHandleChangeCheck,
    handleOnClickRadio: onHandleClickRadio,
    handleOnChangeRadio: onHandleChangeRadio,
    handleOnClickSwitch: onHandleClickSwitch,
    handleOnChangeSwitch: onHandleChangeSwitch,
  },
};

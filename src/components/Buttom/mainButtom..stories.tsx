import { Meta } from '@storybook/react';
import { Button } from 'antd';

export default {
  title: 'Components/Button',
  component: Button,
} as Meta;

export const Primary = () => <Button type="primary" >Button</Button>
export const PrimaryDisabled = () => <Button type="primary" disabled>Button</Button>
export const Default = () => <Button>Button</Button>
export const DefaultDisabled = () => <Button disabled>Button</Button>
export const LargeSize = () => <Button size="large" type="primary" >Button</Button>
export const SmallSize = () => <Button size="small" type="primary" >Button</Button>

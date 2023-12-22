import { Meta, StoryObj } from '@storybook/react';

import CalendarAntd from './CalendarAntd';

const meta: Meta<typeof CalendarAntd> = {
  component: CalendarAntd,
  title: 'Components/Calendar',
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {},
};

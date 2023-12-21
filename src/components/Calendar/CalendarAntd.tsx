import type { Dayjs } from 'dayjs';
import React from 'react';
import { Calendar, theme, Divider, Button } from 'antd';
import type { CalendarProps } from 'antd';
const CalendarAntd = () => {
  const { token } = theme.useToken();
  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  return (
    <div>
        <div className='p-4 w-80 bg-white'>
          <Calendar fullscreen={false} onPanelChange={onPanelChange} />
          <Divider className='mb-2 mt-1' />
          <Button
            type="primary"
          >
            Apply
          </Button>
        </div>
    </div>
  );
};

export default CalendarAntd;

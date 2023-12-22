import { Checkbox, Radio, Switch, Table } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

import './formcustoms.css';
const FormElements = ({
  disabled,
  handleOnClickCheck,
  handleOnChangeCheck,
  handleOnClickRadio,
  handleOnChangeRadio,
  handleOnClickSwitch,
  handleOnChangeSwitch,
}) => {
  const data = [
    { key: 1, col1_1: 'A', col1_2: 'B', col2_1: 'C', col2_2: 'D', col3_1: 'E', col3_2: 'F' },
    // Add more data as needed
  ];

  const columns = [
    {
      title: 'CheckBox',
      dataIndex: 'col1_1',
      key: 'col1_1',
      render: () => (
        <div style={{ display: 'flex' }}>
          <div>
            <div className="checkbox-container">
              <Checkbox
                className="custom-checkbox"
                onClick={handleOnClickCheck}
                onChange={handleOnChangeCheck}
                disabled={disabled}
              />
            </div>
          </div>
          <s></s>
        </div>
      ),
    },
    {
      title: 'Radio',
      dataIndex: 'col2_1',
      key: 'col2_1',
      render: () => (
        <div style={{ display: 'flex' }}>
          <div>
            <div className="radio-container">
              <Radio.Group>
                <Radio
                  className="custom-radio"
                  onChange={handleOnChangeRadio}
                  onClick={handleOnClickRadio}
                  disabled={disabled}
                  value={1}
                />
                <Radio
                  className="custom-radio"
                  onChange={handleOnChangeRadio}
                  onClick={handleOnClickRadio}
                  disabled={disabled}
                  value={2}
                />
              </Radio.Group>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Toogle',
      dataIndex: 'col3_1',
      key: 'col3_1',
      render: () => (
        <div style={{ display: 'flex' }}>
          <div>
            <div className="toogle-container">
              <Switch
                className="custom-toogle"
                disabled={disabled}
                onChange={handleOnChangeSwitch}
                onClick={handleOnClickSwitch}
              />
            </div>
          </div>
        </div>
      ),
    },
  ];
  return (
    <>
      <Table
        dataSource={data}
        columns={columns}
        bordered={false}
        pagination={false} // Optional: if you don't want pagination
        style={{ border: 'none' }} // Optional: additional style to remove any residual border
      />
    </>
  );
};
FormElements.propTypes = {
  disabled: PropTypes.bool.isRequired,
  handleOnClickCheck: PropTypes.func.isRequired,
  handleOnChangeCheck: PropTypes.func.isRequired,
  handleOnClickRadio: PropTypes.func.isRequired,
  handleOnChangeRadio: PropTypes.func.isRequired,
  handleOnClickSwitch: PropTypes.func.isRequired,
  handleOnChangeSwitch: PropTypes.func.isRequired,
};
export default FormElements;

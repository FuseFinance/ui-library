import { Row, Col, Input, Space } from 'antd';
import './inputcustoms.css';
import PropTypes from 'prop-types';

const InputFieldAdn = ({ size, disabled, handleOnChangeInput }) => {
  return (
    <>
      <div style={{width: "400px"}}>
        <Row gutter={[16, 16]}>
          <Col span={3}>
            <Row gutter={[16, 16]}></Row>
            <Row gutter={[16, 16]}></Row>
          </Col>

          <Col span={21}>
            <Row gutter={[16, 16]}></Row>

            <Row gutter={[16, 16]}>
              <Col span={24} className="input-col-custom">
                <Input
                  className="inputClass"
                  placeholder="Single line text or predefined instruction can be added here"
                  onChange={handleOnChangeInput}
                  size={size}
                  disabled={disabled}
                />
                <Space.Compact className="w-full">
                  <Input
                    className="inputClass"
                    placeholder="Single line text or predefined instruction can be added here"
                    onChange={handleOnChangeInput}
                    size={size}
                    disabled={disabled}
                  />
                  <Input
                    className="inputClass"
                    placeholder="Single line text or predefined instruction can be added here"
                    onChange={handleOnChangeInput}
                    size={size}
                    disabled={disabled}
                  />                                  
                </Space.Compact>                
                <Input.TextArea
                  className="inputClass"
                  rows={5}
                  cols={10}
                  placeholder="Multiple line text or predefined instruction can be added here"
                  onChange={handleOnChangeInput}
                  size={size}
                  disabled={disabled}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
};

InputFieldAdn.propTypes = {
  size: PropTypes.oneOf(['small', 'default', 'large']),
  disabled: PropTypes.bool,
  handleOnChangeInput: PropTypes.func.isRequired,
};
export default InputFieldAdn;

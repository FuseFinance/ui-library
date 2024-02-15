import { Input } from 'antd';
import { useState } from 'react';
import { SIMPLE_INPUT_TYPE, SimpleInputCaseProps } from '../types';
import { TooltipFuse } from '../Tooltip';
import { getLabelByType } from './utils';
import { colors } from '@/src/styles';
import { ComplexInputIds } from '@app_ids';

const { TextArea } = Input;

export const Simple = ({
  onChange,
  onBlur,
  value,
  placeholder = '',
  readonly = false,
  type = SIMPLE_INPUT_TYPE.STRING,
}: SimpleInputCaseProps) => {
  const [isFocus, setIsFocus] = useState(false);
  const [inputWidth, setInputWidth] = useState('100%');

  return (
    <div className="!h-9">
      <TextArea
        data-cy={ComplexInputIds.SimpleInputBody}
        className="!h-full !overflow-hidden"
        value={value}
        onResize={(e) => {
          const newWidth = `${e.width}px`;
          setInputWidth(newWidth);
        }}
        onChange={(e) => {
          if (onChange && !readonly) {
            onChange(e.target.value);
          }
        }}
        onBlur={(_value) => {
          setIsFocus(false);
          if (onBlur) {
            onBlur(_value);
          }
          _value.target.style.width = '100%';
        }}
        placeholder={placeholder}
        disabled={readonly}
        style={{
          animation: 'none',
          height: 20,
          resize: isFocus ? 'horizontal' : 'none',
          borderColor: isFocus ? colors.blue[700] : colors.gray[200],
        }}
        onFocus={() => {
          setIsFocus(true);
        }}
      />
      <TooltipFuse type={getLabelByType(type)} active={isFocus} width={inputWidth} />
    </div>
  );
};

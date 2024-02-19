/* eslint-disable @typescript-eslint/no-explicit-any */

import ComplexInput from '@components/ComplexInput';
import {
  FUNCTIONAL_INPUT_TYPE,
  INPUT_TYPES,
  SIMPLE_INPUT_TYPE,
  SimpleInputCaseProps,
} from '@components/ComplexInput/types';
import { ComplexInputIds, DefaultComponentIds } from '@app_ids';
import { fireEvent, render } from '@testUtils';
import { getLabelByType } from '@components/ComplexInput/cases/utils';
import { IProps } from '@/src/components/BaseCodeEditor/types';

const setup = ({
  props = {},
  subcomponent,
}: {
  props?: Record<string, any>;
  subcomponent?: INPUT_TYPES;
}) => {
  if (subcomponent) {
    switch (subcomponent) {
      case INPUT_TYPES.SIMPLE:
        return render(<ComplexInput.Simple {...props} />, {});

      case INPUT_TYPES.FUNCTIONAL:
        return render(<ComplexInput.FunctionalCode {...props} />, {});
      default:
        break;
    }
  }

  return render(<ComplexInput />, {});
};

describe('ComplexInput', () => {
  describe('Complex Input BASE', () => {
    it('should throw error if renders without sub-component', () => {
      const renderComponent = () => setup({});

      expect(renderComponent).toThrow(
        'You must use a subcomponent of ComplexInput, for example ComplexInput.Simple, or create a new input type in "src/components/BaseCodeEditor/cases"',
      );
    });
  });

  describe('Complex Input - Simple Type', () => {
    it('should renders Simple subcomponent', () => {
      const { queryByDataCy } = setup({
        props: {},
        subcomponent: INPUT_TYPES.SIMPLE,
      });

      const input = queryByDataCy(ComplexInputIds.SimpleInputBody);

      expect(input).toBeInTheDocument();
    });

    it('Should not render the tooltip if not active', () => {
      const { queryByDataCy } = setup({
        props: {},
        subcomponent: INPUT_TYPES.SIMPLE,
      });

      const fuseTooltip = queryByDataCy(DefaultComponentIds.fuseTooltipContainer);
      expect(fuseTooltip).not.toBeInTheDocument();
    });

    it('Should render the tooltip if active', () => {
      const { queryByDataCy } = setup({
        props: {},
        subcomponent: INPUT_TYPES.SIMPLE,
      });

      const input = queryByDataCy(ComplexInputIds.SimpleInputBody);

      fireEvent.focus(input);

      const fuseTooltip = queryByDataCy(DefaultComponentIds.fuseTooltipContainer);
      expect(fuseTooltip).toBeInTheDocument();
    });

    it('Should hide the tooltip if enter and then leave the input (onBlur)', () => {
      const { queryByDataCy } = setup({
        props: {},
        subcomponent: INPUT_TYPES.SIMPLE,
      });

      const input = queryByDataCy(ComplexInputIds.SimpleInputBody);

      fireEvent.focus(input);

      const fuseTooltip = queryByDataCy(DefaultComponentIds.fuseTooltipContainer);
      expect(fuseTooltip).toBeInTheDocument();

      fireEvent.blur(input);

      expect(fuseTooltip).not.toBeInTheDocument();
    });

    it('Should render the props correctly', () => {
      const mockValue = '100100100';
      const { queryByDataCy } = setup({
        props: {
          placeholder: 'Mock placeholder fuse Input',
          type: SIMPLE_INPUT_TYPE.NUMBER,
          value: mockValue,
        } as SimpleInputCaseProps,
        subcomponent: INPUT_TYPES.SIMPLE,
      });

      const input = queryByDataCy(ComplexInputIds.SimpleInputBody);

      fireEvent.focus(input);

      const fuseTooltip = queryByDataCy(DefaultComponentIds.fuseTooltipContainer);

      expect(fuseTooltip.textContent).toEqual(`Type: ${getLabelByType(SIMPLE_INPUT_TYPE.NUMBER)}`);
      expect(input.textContent).toEqual(mockValue);
    });

    it('Should render the placeholder if not have value', () => {
      const { getByPlaceholderText } = setup({
        props: {
          placeholder: 'Mock placeholder fuse Input',
          value: undefined, // <- Empty value
        } as SimpleInputCaseProps,
        subcomponent: INPUT_TYPES.SIMPLE,
      });

      const input = getByPlaceholderText('Mock placeholder fuse Input');
      expect(input).toBeInTheDocument();
    });

    it('Should execute the onChange and onBlur methods', () => {
      const mockChangeHandler = jest.fn();
      const mockBlurHandler = jest.fn();

      const { queryByDataCy } = setup({
        props: {
          placeholder: 'Mock placeholder fuse Input',
          value: 'value heree',
          onChange: mockChangeHandler,
          onBlur: mockBlurHandler,
        } as unknown as SimpleInputCaseProps,
        subcomponent: INPUT_TYPES.SIMPLE,
      });

      const input = queryByDataCy(ComplexInputIds.SimpleInputBody);

      fireEvent.change(input, { target: { value: 'New text' } });
      expect(mockChangeHandler).toHaveBeenCalledWith('New text');

      fireEvent.blur(input);
      expect(mockBlurHandler).toHaveBeenCalled();
    });

    it('Should not execute the onChange if is read only', () => {
      const mockChangeHandler = jest.fn();

      const { queryByDataCy } = setup({
        props: {
          placeholder: 'Mock placeholder fuse Input',
          value: 'value heree',
          readonly: true,
          onChange: mockChangeHandler,
        } as unknown as SimpleInputCaseProps,
        subcomponent: INPUT_TYPES.SIMPLE,
      });

      const input = queryByDataCy(ComplexInputIds.SimpleInputBody);

      fireEvent.change(input, { target: { value: 'New text' } });
      expect(mockChangeHandler).not.toHaveBeenCalled();
    });
  });

  describe('Complex Input = Functional Code Type', () => {
    it('should renders FunctionalCode subcomponent', () => {
      const { queryByDataCy } = setup({
        props: {
          value: 'Mock value',
        } as IProps,
        subcomponent: INPUT_TYPES.FUNCTIONAL,
      });

      const input = queryByDataCy(ComplexInputIds.FunctionalCodeInputBody);

      expect(input).toBeInTheDocument();
    });

    it('Should not render the tooltip if not active', () => {
      const { queryByDataCy } = setup({
        props: {},
        subcomponent: INPUT_TYPES.FUNCTIONAL,
      });

      const fuseTooltip = queryByDataCy(DefaultComponentIds.fuseTooltipContainer);
      expect(fuseTooltip).not.toBeInTheDocument();
    });

    it('Should  render the tooltip if is active', () => {
      const mockChangeHandler = jest.fn();
      const mockBlurHandler = jest.fn();

      const { queryByDataCy } = setup({
        props: {
          value: `const user = {
            name: "Mock Name",
            age: 90
          }`,
          onChange: mockChangeHandler,
          onBlur: mockBlurHandler,
          type: FUNCTIONAL_INPUT_TYPE.FORMULA,
        } as IProps,
        subcomponent: INPUT_TYPES.FUNCTIONAL,
      });

      const input = queryByDataCy(ComplexInputIds.FunctionalCodeInputBody);
      const cmLine = input.querySelector('.cm-line');

      fireEvent.focus(cmLine);

      const fuseTooltip = queryByDataCy(DefaultComponentIds.fuseTooltipContainer);
      expect(fuseTooltip).toBeInTheDocument();

      expect(fuseTooltip.textContent).toEqual(
        `Type: ${getLabelByType(FUNCTIONAL_INPUT_TYPE.FORMULA)}`,
      );
    });

    it('Should hide the tooltip if enter and then leave the input (onBlur)', () => {
      const mockChangeHandler = jest.fn();
      const mockBlurHandler = jest.fn();

      const { queryByDataCy } = setup({
        props: {
          value: `const user = {
            name: "Mock Name",
            age: 90
          }`,
          onChange: mockChangeHandler,
          onBlur: mockBlurHandler,
        } as IProps,
        subcomponent: INPUT_TYPES.FUNCTIONAL,
      });

      const input = queryByDataCy(ComplexInputIds.FunctionalCodeInputBody);
      const cmLine = input.querySelector('.cm-line');

      fireEvent.focus(cmLine);

      const fuseTooltip = queryByDataCy(DefaultComponentIds.fuseTooltipContainer);
      expect(fuseTooltip).toBeInTheDocument();

      fireEvent.blur(cmLine);

      expect(fuseTooltip).not.toBeInTheDocument();
    });

    it('Should render the props correctly', () => {
      const mockValue = `const user = {
        name: "Mock Name",
        age: 90
      }`;

      const { queryByDataCy } = setup({
        props: {
          value: mockValue,
          type: FUNCTIONAL_INPUT_TYPE.FORMULA,
        } as IProps,
        subcomponent: INPUT_TYPES.FUNCTIONAL,
      });

      const input = queryByDataCy(ComplexInputIds.FunctionalCodeInputBody);

      const expectedLines = mockValue
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      expectedLines.forEach((line) => {
        expect(input.textContent).toContain(line);
      });
    });

    it('Should render line numbers if the prop hasNumberLines is TRUE', () => {
      const mockValue = 'mock value';

      const { queryByDataCy } = setup({
        props: {
          value: mockValue,
          hasNumberLines: true,
        } as IProps,
        subcomponent: INPUT_TYPES.FUNCTIONAL,
      });

      const input = queryByDataCy(ComplexInputIds.FunctionalCodeInputBody);
      const cmLine = input.querySelector('.cm-lineNumbers');

      expect(cmLine).toBeInTheDocument();
    });

    it('Should not render line numbers if the prop hasNumberLines is FALSE', () => {
      const mockValue = `mock value`;

      const { queryByDataCy } = setup({
        props: {
          value: mockValue,
          hasNumberLines: false,
        } as IProps,
        subcomponent: INPUT_TYPES.FUNCTIONAL,
      });

      const input = queryByDataCy(ComplexInputIds.FunctionalCodeInputBody);
      const cmLine = input.querySelector('.cm-lineNumbers');

      expect(cmLine).not.toBeInTheDocument();
    });
  });
});

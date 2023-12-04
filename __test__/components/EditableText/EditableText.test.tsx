import { fireEvent } from '@testing-library/react';
import { render } from '@utils/test/testUtils';
import EditableText from '@components/EditableText';
import { EditableTextIds } from '@/src/constants/appIDS';

const setUp = (props) => {
  return render(<EditableText {...props} />, {});
};

describe('EditableText Component', () => {
  it('Should renders the correct text "Hello, World!"', () => {
    const label = 'Hello, World!';
    const { getByText } = setUp({ label });
    const labelElement = getByText(label);
    expect(labelElement).toBeInTheDocument();
  });

  it('Should enter in edit mode and renders the input', () => {
    const label = 'Hello, World!';
    const { queryByDataCy } = setUp({ label, canEdit: true });

    const editButton = queryByDataCy(EditableTextIds.editButton);
    fireEvent.click(editButton);

    const inputElement = queryByDataCy(EditableTextIds.input);
    expect(inputElement).toBeInTheDocument();
  });

  it('Should saves changes and exits edit mode on blur', () => {
    const label = 'Hello, World!';
    const newLabel = 'New Label';
    const handleLabelChange = jest.fn();
    const { getByText, queryByDataCy } = setUp({
      label,
      canEdit: true,
      onLabelChange: handleLabelChange,
    });

    const editButton = queryByDataCy(EditableTextIds.editButton);
    fireEvent.click(editButton);

    const inputElement = queryByDataCy(EditableTextIds.input);
    fireEvent.change(inputElement, { target: { value: newLabel } });
    fireEvent.blur(inputElement);

    expect(handleLabelChange).toHaveBeenCalledWith(newLabel);
    const updatedLabelElement = getByText(newLabel);
    expect(updatedLabelElement).toBeInTheDocument();
  });

  it('Should saves changes and exits edit mode on Enter key press', () => {
    const label = 'Hello, World!';
    const newLabel = 'New Label';
    const handleLabelChange = jest.fn();
    const { getByText, queryByDataCy } = setUp({
      label,
      canEdit: true,
      onLabelChange: handleLabelChange,
    });

    const editButton = queryByDataCy(EditableTextIds.editButton);
    fireEvent.click(editButton);

    const inputElement = queryByDataCy(EditableTextIds.input);
    fireEvent.change(inputElement, { target: { value: newLabel } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    expect(handleLabelChange).toHaveBeenCalledWith(newLabel);
    const updatedLabelElement = getByText(newLabel);
    expect(updatedLabelElement).toBeInTheDocument();
  });

  it('Should not render the EditButton if canEdit is FALSE', () => {
    const label = 'Hello, World!';
    const { queryByDataCy } = setUp({ label, canEdit: false });

    const editButton = queryByDataCy(EditableTextIds.editButton);
    expect(editButton).toBeNull();
  });

  it('Should render with different sizes', () => {
    const label = 'Hello, World!';
    const sizes = ['sm', 'md', 'xl', '2xl', '3xl'];

    sizes.forEach((size, i) => {
      const { getAllByDataCy } = setUp({ label, $size: size });
      const labelElement = getAllByDataCy(EditableTextIds.label);
      expect(labelElement[i]).toHaveClass(`font-semibold text- ${size}`);
    });
  });
});

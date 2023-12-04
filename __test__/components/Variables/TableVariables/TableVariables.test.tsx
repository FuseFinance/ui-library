import { fireEvent, render } from '@utils/test/testUtils';
import { VariablesIds } from '@constants/appIDS';
import TableVariables from '@/src/components/TableVariables';
import { mockEnvironmentVariables } from '@/__mocks__/environmentVariableMocks';

let mockHandleSelectVariable = jest.fn();
let mockItems = mockEnvironmentVariables;
let mockIsFuseUser = true;

const setUp = () => {
  return render(
    <TableVariables
      handleSelectVariable={mockHandleSelectVariable}
      items={mockItems}
      isFuseUser={mockIsFuseUser}
    />,
    {},
  );
};

describe('Test Table Variables component', () => {
  beforeEach(() => {
    mockHandleSelectVariable = jest.fn();
    mockIsFuseUser = true;
  });

  it('Should render', () => {
    const { getByDataCy } = setUp();
    const variablesTable = getByDataCy(VariablesIds.table);
    expect(variablesTable).toBeInTheDocument();
  });

  it('Should render development column and row if fuseUser is true', () => {
    const { getByDataCy } = setUp();
    const developmentColumn = getByDataCy(VariablesIds.developmentColumn);
    const developmentRow = getByDataCy(VariablesIds.developmentRow);
    expect(developmentColumn && developmentRow).toBeInTheDocument();
  });

  it('Should render 3 columns if fuseUser is false', () => {
    mockIsFuseUser = false;
    const { getByDataCy } = setUp();
    const tableHeader = getByDataCy(VariablesIds.tableHeader);
    expect(tableHeader.children.length).toBe(3);
  });

  it('Should call handleSelectVariable on row click', () => {
    const { getByDataCy } = setUp();
    const tableRow = getByDataCy(VariablesIds.tableRow);
    fireEvent.click(tableRow);
    expect(mockHandleSelectVariable).toHaveBeenCalled();
  });
});

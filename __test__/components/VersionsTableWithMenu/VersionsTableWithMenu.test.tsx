import { render } from '@utils/test/testUtils';
import { fireEvent } from '@testing-library/react';
import { mockTotalUnpublishedVersions, mockUnpublishedVersions } from "@/__mocks__/unpublishedVersionsMocks";
import VersionsTableWithMenu from "@/src/components/VersionsTableWithMenu";
import { DefaultComponentIds, EditorIds, VersionsTableWithMenuIds } from '@/src/constants/appIDS';
import { MemoryRouter } from 'react-router-dom';
import { IconList } from '@/src/components/Icons/types';

let mockHandleClose = jest.fn();
let mockHandleUnpublishedPagination = jest.fn();
let mockItems = mockUnpublishedVersions;
let mockTotalItems = mockTotalUnpublishedVersions;

const setUp = (mockItems: any) => {
  return render(
    <MemoryRouter>
      <VersionsTableWithMenu
          withDropDown={true}
          title="Edit Versions"
          versions={mockItems}
          type="Edit"
          size="small"
          handleClose={mockHandleClose}
          totalVersions={mockTotalItems}
          defaultCurrent={1}
          handlePagination={mockHandleUnpublishedPagination}
      />
    </MemoryRouter>,
  {},
  );
};

describe('VersionsTableWithMenu component', () => {
    beforeEach(() => {
        mockHandleClose = jest.fn();
        mockHandleUnpublishedPagination = jest.fn();
      });

      it('Should render 2 records with dropdown', () => {
        const { queryAllByDataCy } = setUp(mockItems);
        const editVersionsTableWithDropdown = queryAllByDataCy(DefaultComponentIds.dropdown);
        expect(editVersionsTableWithDropdown.length).toBe(2);
      });

      it('Should render with mocked rows', () => {
        const { queryAllByDataCy } = setUp(mockItems);
        const versionRows = queryAllByDataCy(VersionsTableWithMenuIds.row);
        expect(versionRows.length).toBeGreaterThanOrEqual(1);
      });

      it('Should tag one outdated version', () => {
        const { container } = setUp(mockItems);
        const warningElements = container.getElementsByClassName('ant-tag ant-tag-warning');
        expect(warningElements.length).toBeGreaterThanOrEqual(1);
      });

      it('Should render with dropdown closed', () => {
        const { container } = setUp(mockItems);
        expect(container.getElementsByClassName('ant-dropdown-open')).toHaveLength(0);
      });

})

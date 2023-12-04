import { render } from '@utils/test/testUtils';
import { ShareWorkflowModal } from '@components/SharedWorkflows/ImportModal/ShareWorkflowModal';
import { EModalWFAction } from '@components/SharedWorkflows/ImportModal/types';
import { SharedWorkflowImportIds } from '@constants/appIDS';

const mockFunc = jest.fn();
jest.mock('@constants/env', () => ({
  FRONT_CLIENT: 'test-client',
  BE_URL: '',
}));

const setUp = (action: EModalWFAction, isOpen: boolean) => {
  return render(
    <ShareWorkflowModal
      setIsOpen={mockFunc}
      refetchWfs={mockFunc}
      action={action}
      isOpen={isOpen}
    />,
    {},
  );
};

// TODO: Juan A Add complete test suit for component
describe('Test import Shared WF as a Fuse Admin', () => {
  it('Should render import modal when is open true', () => {
    const { getByDataCy } = setUp(EModalWFAction.IMPORT, true);
    const modal = getByDataCy(SharedWorkflowImportIds.modalContainer);
    expect(modal).toBeInTheDocument();
  });
  it('Should not render import modal when is open false', () => {
    const { queryByDataCy } = setUp(EModalWFAction.IMPORT, false);
    const modal = queryByDataCy(SharedWorkflowImportIds.modalContainer);
    expect(modal).not.toBeInTheDocument();
  });
});

import { fireEvent, getByText, render, waitFor } from '@utils/test/testUtils';
import { PublishVersionModalIds } from '@constants/appIDS';
import { PublishVersionModal } from '@/src/components/Modals/PublishVersion';
import { Roles } from '@/src/utils/types/sharedEnums';
import { v4 as uuidv4 } from 'uuid';
import { Version } from '@/src/types/services/versions';

const mockFunc = jest.fn();

jest.mock('@constants/env', () => ({
  FRONT_CLIENT: 'test-client',
  BE_URL: '',
}));

const selectedVersion = {
  id: uuidv4(),
  versionNumber: 'v.0.0.0',
  name: 'Test Version',
  environment: 'test',
  description: null,
  deployedAt: null,
  isProduction: false,
  isSandbox: false,
  isDevelopment: false,
};

jest.mock('@services/versions', () => ({
  useDeployVersion: () => ({
    deployVersion: jest.fn(),
  }),
  usePublishVersion: () => ({
    publishVersion: jest.fn(),
  }),
}));

const setUp = (isOpen: boolean, role: Roles, selectedVersion: Version) => {
  return render(
    <PublishVersionModal
      showDevelopmentEnv={role === Roles.FUSE_ADMIN}
      selectedVersion={selectedVersion}
      open={isOpen}
      onClose={mockFunc}
      onSave={mockFunc}
    />,
    {},
  );
};

describe('Test Publish Version Modal', () => {
  it('Should render when is open true', () => {
    const { getByDataCy } = setUp(true, Roles.FUSE_ADMIN, selectedVersion);
    const modal = getByDataCy(PublishVersionModalIds.modal);
    expect(modal).toBeInTheDocument();
  });

  it('Should render 3 inputs for release options', () => {
    const { getByDataCy } = setUp(true, Roles.FUSE_ADMIN, selectedVersion);
    const optionGroup = getByDataCy(PublishVersionModalIds.releaseOptions);
    const releaseOptions = optionGroup.getElementsByTagName('input');
    expect(releaseOptions.length).toBe(3);
  });

  it('Should calculate right release versions', () => {
    const { getByDataCy } = setUp(true, Roles.FUSE_ADMIN, selectedVersion);
    const optionGroup = getByDataCy(PublishVersionModalIds.releaseOptions);
    const releaseOptions = optionGroup.getElementsByTagName('label');
    expect(releaseOptions[0]).toHaveTextContent('Major (v.1.0.0)');
    expect(releaseOptions[1]).toHaveTextContent('Minor (v.0.1.0)');
    expect(releaseOptions[2]).toHaveTextContent('Patch (v.0.0.1)');
  });

  it('Should change release version', () => {
    const { getByDataCy } = setUp(true, Roles.FUSE_ADMIN, selectedVersion);
    const optionGroup = getByDataCy(PublishVersionModalIds.releaseOptions);
    const releaseOptions = optionGroup.getElementsByTagName('input');
    fireEvent.click(releaseOptions[0]);
    expect(releaseOptions[0]).toBeChecked();
  });

  it('Should render Development option when Role = FUSE_ADMIN', () => {
    const { getByDataCy } = setUp(true, Roles.FUSE_ADMIN, selectedVersion);
    const modal = getByDataCy(PublishVersionModalIds.modal);
    const publishButton = getByText(modal, 'Development', { selector: 'label' });
    expect(publishButton).toBeInTheDocument();
  });

  it('Version name input value should be = selectedVersion name', () => {
    const { getByDataCy } = setUp(true, Roles.FUSE_ADMIN, selectedVersion);
    const versionNameInput = getByDataCy(PublishVersionModalIds.versionNameInput);

    expect(versionNameInput).toHaveDisplayValue(selectedVersion.name);
  });

  it('On save action should be called', async () => {
    const { getByDataCy } = setUp(true, Roles.FUSE_ADMIN, selectedVersion);
    const modal = getByDataCy(PublishVersionModalIds.modal);
    const publishButton = getByText(modal, 'Publish Version', { selector: 'span' });
    fireEvent.click(publishButton);
    await waitFor(() => {
      expect(mockFunc).toHaveBeenCalled();
    });
  });
});

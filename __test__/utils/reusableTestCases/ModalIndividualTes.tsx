import { TestInputContentIds, TestOutputContentIds } from '../../../src/constants/appIDS';

export const runTestsModalIndividualCases = (setup) => {
  describe('Reusable Teste Cases for Modal Test', () => {
    describe('Render the principal InputContent elements', () => {
      it('Should render Container', () => {
        const { queryByDataCy } = setup();

        const container = queryByDataCy(TestInputContentIds.container);
        expect(container).toBeInTheDocument();
      });

      it('Should render Dropdown', () => {
        const { queryByDataCy } = setup();

        const dropdown = queryByDataCy(TestInputContentIds.dropdown);
        expect(dropdown).toBeInTheDocument();
      });

      it('Should render Text Input (Code Editor)', () => {
        const { queryByDataCy } = setup();

        const codeEditor = queryByDataCy(TestInputContentIds.inputCodeEditor);
        expect(codeEditor).toBeInTheDocument();
      });

      it('Should render menu actions', () => {
        const { queryByDataCy } = setup();

        const select = queryByDataCy(TestInputContentIds.select);
        expect(select).toBeInTheDocument();
      });
    });

    describe('Render the principal OutputContent elements', () => {
      it('Should render Container', () => {
        const { queryByDataCy } = setup();

        const container = queryByDataCy(TestOutputContentIds.container);
        expect(container).toBeInTheDocument();
      });

      it('Should render the Tabs', () => {
        const { queryByDataCy } = setup();

        const tabs = queryByDataCy(TestOutputContentIds.tabs);
        expect(tabs).toBeInTheDocument();
      });

      it('Should render Result Section', () => {
        const { queryByDataCy } = setup(true);

        const result = queryByDataCy(TestOutputContentIds.resultSection);
        expect(result).toBeInTheDocument();
      });
    });
  });
};

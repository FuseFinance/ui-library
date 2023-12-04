import CodeEditor from '../../../src/components/CodeEditor/codeEditor';

describe('<CodeEditor />', () => {
  it('Renders', () => {
    cy.mount(<CodeEditor />);
  });

  it('Can write', () => {
    let test = '';
    cy.mount(
      <CodeEditor
        value={test}
        onChange={(value) => {
          test = value;
        }}
      />,
    ),
      cy
        .get('.cm-editor')
        .click()
        .type('test')
        .then(() => {
          cy.get('.cm-line').should('contain', 'test');
        });
  });

  it('Autocomplete display', () => {
    let test = '';
    cy.mount(
      <CodeEditor
        value={test}
        onChange={(value) => {
          test = value;
        }}
        configVars={[{ name: 'test', value: 'test', type: 'test', id: 'test' }]}
      />,
    ),
      cy
        .get('.cm-editor')
        .click()
        .type('test')
        .then(() => {
          cy.get('.cm-tooltip-autocomplete').should('exist');
        });
  });

  it('Readonly works', () => {
    let test = '';
    cy.mount(
      <CodeEditor
        value={test}
        onChange={(value) => {
          test = value;
        }}
        readonly
      />,
    ),
      cy
        .get('.cm-editor')
        .click()
        .type('test')
        .then(() => {
          cy.get('.cm-line').then((element) => element === undefined);
        });
  });

  it('Max lines works', () => {
    let test = '';
    cy.mount(
      <CodeEditor
        value={test}
        onChange={(value) => {
          test = value;
        }}
        maxLines={1}
      />,
    ),
      cy
        .get('.cm-editor')
        .click()
        .type('{enter}')
        .then(() => {
          cy.get('.cm-line').should('have.length', 1);
        });
  });

  it('Line Wrapping works', () => {
    let test = '';
    cy.mount(
      <CodeEditor
        value={test}
        onChange={(value) => {
          test = value;
        }}
        lineWrapping
      />,
    ),
      cy
        .get('.cm-editor')
        .click()
        .type(
          'Lorem ipsum dolor sit amet. Consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
        )
        .then(() => {
          cy.get('.ͼs').contains('.').should('be.visible');
        });
  });

  it('Applicant plugin works', () => {
    let test = '';
    cy.mount(
      <CodeEditor
        value={test}
        onChange={(value) => {
          test = value;
        }}
      />,
    ),
      cy
        .get('.cm-editor')
        .click()
        .type('applicant')
        .then(() => {
          cy.get('.cm-tooltip-autocomplete').should('exist');
        });
  });

  it('Vehicle plugin works', () => {
    let test = '';
    cy.mount(
      <CodeEditor
        value={test}
        onChange={(value) => {
          test = value;
        }}
      />,
    ),
      cy
        .get('.cm-editor')
        .click()
        .type('vehicle')
        .then(() => {
          cy.get('.cm-tooltip-autocomplete').should('exist');
        });
  });
});

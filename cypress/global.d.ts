/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    loginByAuth0Api(username: string, password: string): Chainable<Response>;
    login(username: string, password: string): Chainable<Response>;
    loginWithUi(applicationUrl?: string): Chainable<Response>;
    logout(): Chainable<Response>;
    createVersion(createVersion: string, applicationUrl?: string): Chainable<Response>;
    renameVersion(newName: string, versionName: string): Chainable<Response>;
    deleteVersion(versionName: string): Chainable<Response>;
    publishVersion(
      versionName: string,
      selectToDeploy?: string,
      applicationUrl?: string,
    ): Chainable<Response>;
    createWorkflow(
      versionName: string,
      workflowNameToSave?: string,
      applicationUrl?: string,
    ): Chainable<Response>;
    renameWorkflow(wfName: string, newWfName: string, versionName: string): Chainable<Response>;
    deleteWorkflow(versionName: string, wfName: string): Chainable<Response>;
    copyToClipboardWorkflow(versionName: string, wfName: string): Chainable<Response>;
    duplicateWorkflow(versionName: string, wfName: string): Chainable<Response>;
    findInVersionTable(versionName: string, tableType: string): Chainable<Response>;
    deployVersion(versionName: string): Chainable<Response>;
    startBlockCreation(blockType: string, blockName: string): Chainable<Response>;
    saveBlock(): Chainable<Response>;
    createFormulaBlock(blockName: string, formula?: string): Chainable<Response>;
    deleteBlock(blockName: string): Chainable<Response>;
    moveBlock(blockName: string): Chainable<Response>;
    runIndividualTest(
      blockName: string,
      input: string,
      successCriteria: string,
      expectedOutput: string,
    ): Chainable<Response>;
    createWorkflowTest(VersionName?: string, workflowId?: string): Chainable<Response>;
    deleteWorkflowTest(VersionName?: string, workflowId?: string): Chainable<Response>;
    runWorkflowTest(): Chainable<Response>;
    renameWorkflowTest(testName: string): Chainable<Response>;
    createEnvironmentVariable(variableName: string, variableInput: string): Chainable<Response>;
    deleteEnvironmentVariable(variableName: string): Chainable<Response>;
    createIfCondition(blockName: string): Chainable<Response>;
    createSplitPath(blockName: string): Chainable<Response>;
    createBlockInsideSplitPath(pathIndex: number, blockName: string): Chainable<Response>;
    createGroupBlock(): Chainable<Response>;
    renameGroupBlock(newName: string, groupName: string): Chainable<Response>;
    deleteGroupBlock(groupName: string): Chainable<Response>;
    moveGroupBlock(groupName: string): Chainable<Response>;
    deleteBlock(blockName: string): Chainable<Response>;
    moveBlock(blockName: string): Chainable<Response>;
    collapseOrExpandGroup(groupName: string, isCollapse: boolean): Chainable<Response>;
    createBlockInsideGroup(blockName: string): Chainable<Response>;
    createConditionTableBlock(blockName: string): Chainable<Response>;
    addTopAndSideColAndRows(blockName: string): Chainable<Response>;
    addTopAndSideHeaders(blockName: string): Chainable<Response>;
    createGoToBlock(blockName: string, blockToConnect: string): Chainable<Response>;
    checkIfGotoIsEmpty(blockName: string): Chainable<Response>;
    createApiCallBlock(
      blockName: string,
      method: string,
      withCertificate: boolean,
    ): Chainable<Response>;
    createNestedLoop(blockName: string, edgePos: number): Chainable<Response>;
    insertBodyApiCall(blockName: string): Chainable<Response>;
    createAsyncResponseBlock(blockName: string, custom: boolean): Chainable<Response>;
    insertBodyAsyncResponse(blockName: string): Chainable<Response>;
    rebaseVersion(versionName: string): Chainable<Response>;
    checkVersionRebase(versionName: string, isRebased: boolean): Chainable<Response>;
    checkAmountOfHistory(amount: number): Chainable<Response>;
    restoreWfToFistState(wfName: string): Chainable<Response>;
    waitForLoading(): Chainable<Response>;
    createSubworkflowBlock(
      blockName: string,
      blockToConnect: string,
      variableName?: string,
    ): Chainable<Response>;
    createCustomCodeBlock(blockName: string, code: string);
    createAlertBlock(blockName: string, description: string);
    createConverterBlock(
      blockName: string,
      convertFrom?: string,
      convertTo?: string,
      inputData?: string,
      outputVariable?: string,
    ): Chainable<Response>;
    createJsonataBlock(blockName: string, expression: string);
    createDBConnectionBlock(
      blockName: string,
      schema?: string,
      query?: string,
      outputVariable?: string,
    );
    createS3Block(blockName: string);
    createLoop(blockName: string): Chainable<Response>;
    createSftpBlock(blockName: string);
  }
}

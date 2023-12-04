export const DefaultSelectors = {
  dropdown: '[data-cy="DefaultComponentIds_dropdown"]',
  codeEditor: '[data-cy="DefaultComponentIds_codeEditor"]',
  modal: '[data-cy="DefaultComponentIds_modal"]',
  modalContent: '[data-cy="DefaultComponentIds_modalContent"]',
  modalFooter: '[data-cy="DefaultComponentIds_modalFooter"]',
  modalHeader: '[data-cy="DefaultComponentIds_modalHeader"]',
  modalCloseIcon: '[data-cy="Icon-Cross"]',
  modalCloseBtn: '[data-cy="DefaultComponentIds_modalCloseBtn"]',
};

export const EditableTextSelector = {
  editButton: '[data-cy="EditableTextIds_editButton"]',
  input: '[data-cy="EditableTextIds_input"]',
  label: '[data-cy="EditableTextIds_label"]',
};

export const LoginSelectors = {
  userNameInput: 'input#username',
  passwordInput: 'input#password',
  continueBtn: 'button[value=default]',
  token2FaInput: 'input#code',
  rememberBrowser: 'input#rememberBrowser',
};

export const LogoutSelector = {
  logoutBtn: '[data-cy="logoutBtn"]',
};

export const VersionsSelector = {
  openModalBtn: '[data-cy="CreateVersionIds_openModalBtn"]',
  input: '[data-cy="CreateVersionIds_input"]',
  versionsTable: '[data-cy="CreateVersionIds_versionsTable"]',
  versionsTableWithMenuIdsRow: '[data-cy="VersionsTableWithMenuIds_row"]',
  rowName: '[data-cy="VersionsTableWithMenuIds_row_0"]',
  createBtn: '[data-cy="CreateVersionIds_createBtn"]',
  editVersionTable: '[data-cy="VersionsPageIds_editVersionsTable"]',
  publishVersionsTable: '[data-cy="VersionsPageIds_publishVersionsTable"]',
  renameModal: '[data-cy="VersionsPageIds_modalRename"]',
  inputRename: '[data-cy="VersionsPageIds_inputRename"]',
  deleteModal: '[data-cy="VersionsPageIds_modalDelete"]',
  rebaseModal: '[data-cy="VersionsPageIds_modalRebase"]',
  tagRebase: '[data-cy="VersionsTableWithMenuIds_tagRebase"]',
};

export const PublishVersionSelector = {
  publishModal: '[data-cy="PublishVersionModalIds_modal"]',
  input: '[data-cy="PublishVersionModalIds_versionNameInput"]',
  releaseOptions: '[data-cy="PublishVersionModalIds_releaseOptions"]',
  deployOptions: '[data-cy="PublishVersionModalIds_deployOptions"]',
  saveBtn: '[data-cy="PublishVersionModalIds_saveBtn"]',
};

export const WorkflowsSelector = {
  page: '[data-cy="WorkflowsPageIds_page"]',
  workflowsTable: '[data-cy="WorkflowsPageIds_workflowsTable"]',
  workflowsTableRow: '[data-cy="WorkflowsPageIds_row"]',
  modalCreate: '[data-cy="WorkflowsPageIds_modalCreate"]',
  modalRename: '[data-cy="WorkflowsPageIds_modalRename"]',
  modalDelete: '[data-cy="WorkflowsPageIds_modalDelete"]',
  inputRename: '[data-cy="WorkflowsPageIds_inputRename"]',
  inputCreate: '[data-cy="WorkflowsPageIds_inputCreate"]',
  createBtn: '[data-cy="WorkflowsPageIds_createBtn"]',
  createBtnDropDown: '[data-cy="WorkflowsPageIds_createBtnDropDown"]',
  addStepButton: '[data-cy="EditorIds_addButton"]',
  testWorkflowButton: '[data-cy="EditorIds_testButton"]',
};

export const DeployModalSelector = {
  modal: '[data-cy="DeployModalIds_modal"]',
  deployBtn: '[data-cy="DeployModalIds_deployBtn"]',
  options: '[data-cy="DeployModalIds_options"]',
};

export const EditorSelector = {
  flowcanvas: '[data-cy="EditorIds_flowcanvas"]',
  nodeOptionsButton: '[data-cy="EditorIds_nodeOptionsButton"]',
  nodeContainer: '[data-cy="EditorIds_nodeContainer"]',
  placeHereButton: '[data-cy="EditorIds_placeHereButton"]',
  addButton: '[data-cy="EditorIds_addButton"]',
};

export const AddNewBlockModalSelector = {
  addBlockContent: '[data-cy="AddNewBlockModalIds_addBlockContent"]',
};

export const IndividualTestSelector = {
  inputCodeEditor: '[data-cy="TestInputContentIds_inputCodeEditor"]',
  runTestBtn: '[data-cy="DefaultComponentIds_runTestButton"]',
  resultSection: '[data-cy="TestOutputContentIds_resultSection"]',
  outputContainer: '[data-cy="TestOutputContentIds_container"]',
};

export const TestPageSelector = {
  createTestButton: '[data-cy="TestPageIds_createTestButton"]',
  addDropdownButton: '[data-cy="TestPageIds_addDropdownButton"]',
  individualTestContainer: '[data-cy="TestPageIds_individualTestContainer"]',
  runTestButton: '[data-cy="TestPageIds_runTestButton"]',
  testSidebarItem: '[data-cy="TestPageIds_testSidebarItem"]',
  testSidebarItemDropdownButton: '[data-cy="TestPageIds_testSidebarItemDropdownButton"]',
  testSidebarItemInput: '[data-cy="TestPageIds_testSidebarItemInput"]',
  successCriteria: '[data-cy="TestPageIds_successCriteria"]',
  configBody: '[data-cy="TestPageIds_body"]',
  searchExecutionInput: '[data-cy="TestPageIds_searchExecutionInput"]',
};

export const HistorySelector = {
  executionResult: '[data-cy="HistoryIds_executionResult"]',
  executionItem: '[data-cy="HistoryIds_executionItem"]',
};

export const VariableSelector = {
  createEnvVarButton: '[data-cy="VariablesIds_createEnvVarButton"]',
  envVarNameInput: '[data-cy="VariablesIds_envVarNameInput"]',
  envVarProdInput: '[data-cy="VariablesIds_envVarProdInput"]',
  envVarSandboxInput: '[data-cy="VariablesIds_envVarSandboxInput"]',
  envVarDevInput: '[data-cy="VariablesIds_envVarDevInput"]',
  saveEnvVarButton: '[data-cy="VariablesIds_saveEnvVarButton"]',
  deleteEnvVarButton: '[data-cy="VariablesIds_deleteEnvVarButton"]',
  tableRow: '[data-cy="VariablesIds_tableRow"]',
};

export const IfConditionEditorSelector = {
  body: '[data-cy="IfThenModalIds_body"]',
  ifInputContainer: '[data-cy="IfThenModalIds_ifInput"]',
  elseInputContainer: '[data-cy="IfThenModalIds_elseInput"]',
  addElseIfBtn: '[data-cy="IfThenModalIds_addElseIfBtn"]',
  addElseBtn: '[data-cy="IfThenModalIds_addElseBtn"]',
};

export const SplitPathEditorSelector = {
  body: '[data-cy="SplitPathModalIds_body"]',
  input: '[data-cy="SplitPathModalIds_codeEditor"]',
  addSplitPath: '[data-cy="SplitPathModalIds_addBranchBtn"]',
};

export const GroupEditorSelector = {
  nodeContainer: '[data-cy="NodeGroupBlockIds_container"]',
};

export const ConditionTableSelector = {
  tableContainer: '[data-cy="ConditionTableModalIds_tableContainer"]',
  variablesContainer: '[data-cy="ConditionTableModalIds_variablesContainer"]',
  tableRow: '[data-cy="ConditionTableModalIds_conditionRow"]',
  outputVariable: '[data-cy="ConditionTableModalIds_outputVarInput"]',
  delCol: '[data-cy="ConditionTableModalIds_delColIconContainer"]',
  delRow: '[data-cy="ConditionTableModalIds_delLeftHeadBtnContainer"]',
  topHeaderContainer: '[data-cy="ConditionTableModalIds_topHeaderContainer"]',
  leftHeaderContainer: '[data-cy="ConditionTableModalIds_leftHeaderContainer"]',
  conditionRow: '[data-cy="ConditionTableModalIds_conditionRow"]',
  addRowBtn: '[data-cy="ConditionTableModalIds_addRowBtn"]',
  addColBtn: '[data-cy="ConditionTableModalIds_addColBtn"]',
  addHeaderDropdown: '[data-cy="ConditionTableModalIds_addHeaderDropdown"]',
  addTopHeadBtn: '[data-cy="ConditionTableModalIds_addColBtn"]',
  addLeftHeadBtn: '[data-cy="ConditionTableModalIds_addLeftHeadBtn"]',
};

export const GoToSelector = {
  autocompleteInput: '[data-cy="GoToEditorIds_autocompleteInput"]',
};

export const ApiCallSelector = {
  selectMethodDropdown: '[data-cy="ApiCallModalIds_selectMethodDropdown"]',
  inputURL: '[data-cy="ApiCallModalIds_inputURL"]',
  inputHeader: '[data-cy="ApiCallModalIds_inputHeader"]',
  inputOutputVariable: '[data-cy="ApiCallModalIds_inputOutputVariable"]',
  inputCertificateFile: '[data-cy="ApiCallModalIds_inputCertificateFile"]',
  inputKeyFile: '[data-cy="ApiCallModalIds_inputKeyFile"]',
  inputBody: '[data-cy="ApiCallModalIds_inputBody"]',
};

export const AsyncResponseSelector = {
  selectCustomResponseFalse: '[data-cy="AsyncResponseModalIds_customResponseFalseOption"]',
  selectCustomResponseTrue: '[data-cy="AsyncResponseModalIds_customResponseTrueOption"]',
  inputHTTPStatus: '[data-cy="AsyncResponseModalIds_httpStatusVariable"]',
  inputHeader: '[data-cy="AsyncResponseModalIds_inputHeader"]',
  inputOutputVariable: '[data-cy="AsyncResponseModalIds_inputOutputVariable"]',
  inputBody: '[data-cy="AsyncResponseModalIds_inputBody"]',
};

export const RestoreHistorySelector = {
  navBtn: '[data-cy="EditorIds_restoreNavBarBtn"]',
  restoreModal: '[data-cy="EditorIds_restoreModal"]',
  restoreLink: '[data-cy="EditorIds_restoreLink"]',
  restoreBlock: '[data-cy="EditorIds_restoreBlock"]',
};

export const SharedWorkflowsSelector = {
  modalImportSharedWf: '[data-cy="SharedWorkflowImportIds_modalImportSharedWf"]',
  selectWorkflowDropdownButton: '[data-cy="SharedWorkflowImportIds_selectWorkflowDropdownButton"]',
  importButton: '[data-cy="SharedWorkflowImportIds_importButton"]',
  modalImportSharedWfJson: '[data-cy="SharedWorkflowImportIds_modalImportSharedWfJson"]',
};

export const Loaders = {
  loading: '[data-cy="Loaders_loading"]',
};
export const SubworkflowSelector = {
  autocompleteInput: '[data-cy="SubworkflowEditorIds_autocompleteInput"]',
  variableNameInput: '[data-cy="SubworkflowEditorIds_variableNameInput"]',
};

export const CustomCodeSelector = {
  outputVariableInput: '[data-cy="CustomCodeEditorIds_outputVariableInput"]',
};

export const ConverterSelector = {
  inputData: '[data-cy="ConverterModalIds_inputData"]',
  outputVariable: '[data-cy="ConverterModalIds_outputVariable"]',

  convertFrom: '[data-cy="ConverterModalIds_convertFrom"]',
  convertTo: '[data-cy="ConverterModalIds_convertTo"]',
};

export const DBConnectionNodeSelector = {
  query: '[data-cy="DBConnectionModalIds_query"]',
  selectSchema: '[data-cy="DBConnectionModalIds_selectSchema"]',
  outputVariable: '[data-cy="DBConnectionModalIds_outputVariable"]',
};

export const S3UploadSelector = {
  fileContentsInput: '[data-cy="S3UploadModalIds_fileContentsInput"]',
  bucketNameInput: '[data-cy="S3UploadModalIds_bucketNameInput"]',
  objectKeyInput: '[data-cy="S3UploadModalIds_objectKeyInput"]',
  awsRegionInput: '[data-cy="S3UploadModalIds_awsRegionInput"]',
  accessKeyInput: '[data-cy="S3UploadModalIds_accessKeyInput"]',
  secretAccessKeyInput: '[data-cy="S3UploadModalIds_secretAccessKeyInput"]',
  outputVariableInput: '[data-cy="S3UploadModalIds_outputVariableInput"]',
};

export const SftpUploadSelector = {
  fileContentsInput: '[data-cy="SftpUploadModalIds_fileContentsInput"]',
  userNameInput: '[data-cy="SftpUploadModalIds_userNameInput"]',
  passwordInput: '[data-cy="SftpUploadModalIds_passwordInput"]',
  portNumberInput: '[data-cy="SftpUploadModalIds_portNumberInput"]',
  serverAddressInput: '[data-cy="SftpUploadModalIds_serverAddressInput"]',
  pathForFileInput: '[data-cy="SftpUploadModalIds_pathForFileInput"]',
  outputVariableInput: '[data-cy="SftpUploadModalIds_outputVariableInput"]',
};

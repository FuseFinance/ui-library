export const flags = {
  // Pages
  DB_SCHEMA: 'db-schema',
  DB_CONNECTION: 'db-connection',
  PAGE_TEMP_DATA: 'page-temp-data',
  PAGE_NOTIFICATIONS_CONFIG: 'page-notifications-config',
  PAGE_SCHEDULED_CONFIG: 'page-scheduled-config',

  // Steps (Nodes)
  CONVERTER_STEP: 'wf-converter-step',
  SUBWORKFLOW_STEP: 'wf-subworkflow-step',
  CUSTOM_CODE_STEP: 'wf-custom-code-step',
  JSONATA_STEP: 'wf-jsonata-step',
  ALERT_STEP: 'wf-alert-step',
  PARTIAL_TESTS: 'wf-partial-tests',
  VISUAL_TRACE: 'wf-visual-trace',
  DB_QUERY_STEP: 'wf-db-query-step',
  APP_STATUS_CHANGE_STEP: 'wf-app-status-change-step',
  ASYNC_RESPONSE_STEP: 'wf-async-response-step',
  DB_CONNECTION_STEP: 'wf-db-connection-step',
  LOOP_STEP: 'wf-loop-step',
  S3_UPLOAD_STEP: 'wf-s3-upload-step',
  SFTP_UPLOAD_STEP: 'wf-sftp-upload-step',
  HANDLE_API_CALL_CERTIFICATE: 'wf-handle-api-call-certificate',

  // Features
  COPY_WF_CLIPBOARD: 'feat-copy-wf-clipboard',
} as const;

export type FuseFlags = (typeof flags)[keyof typeof flags];

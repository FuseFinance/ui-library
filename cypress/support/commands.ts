// @ts-check
///<reference types="cypress" />
///<reference path="../global.d.ts" />

import './auth/loginWithApi';
import './auth/loginWithUi';
import './auth/logout';
import './versions/createVersion';
import './versions/renameVersion';
import './versions/deleteVersion';
import './versions/publishVersion';
import './versions/deployVersion';
import './versions/rebaseVersion';

import './workflows/createWorkflow';
import './workflows/renameWorkflow';
import './workflows/deleteWorkflow';
import './workflows/duplicateWorkflow';
import './workflows/copyToClipboardWorkflow';

import './editor/formulaBlock';
import './editor/groupBlock';
import './editor/ifConditionBlock';
import './editor/splitPathBlock';
import './editor/groupBlock';
import './editor/conditionTableBlock';
import './editor/goToBlock';
import './editor/apiCallBlock';
import './editor/subworkflowBlock';
import './editor/restoreHystory';
import './editor/customCodeBlock';
import './editor/converterBlock';
import './editor/jsonataBlock';
import './editor/asyncResponseBlock';
import './editor/alertBlock';
import './editor/dbConnectionBlock';
import './editor/s3UploadBlock';
import './editor/loopBlock';
import './editor/sftpUpload';

import './testing/individualTest';
import './testing/createWorkflowTest';
import './testing/renameWorkflowTest';
import './testing/deleteWorkflowTest';
import './testing/runWorkflowTest';

import './variables/createEnvironmentVariable';
import './variables/deleteEnvironmentVariable';

import './helpers/findInVersionTable';
import './helpers/blocksUtils';
import './helpers/waitForLoading';

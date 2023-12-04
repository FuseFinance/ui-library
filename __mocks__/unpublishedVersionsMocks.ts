import { v4 as uuidv4 } from 'uuid';

export const mockUnpublishedVersions = [
  {
      "id": uuidv4(),
      "versionNumber": "Demo",
      "name": "Demo",
      "environment": "Demo",
      "description": null,
      "deployedAt": null,
      "isProduction": false,
      "isSandbox": false,
      "activeUser": null,
      "updatedAt": "2023-09-06T19:15:13.814Z",
      "isOutdated": false,
      "isDevelopment": false
  },
  {
      "id": uuidv4(),
      "versionNumber": "Demo-2",
      "name": "Demo-2",
      "environment": "Demo-2",
      "description": null,
      "deployedAt": null,
      "isProduction": false,
      "isSandbox": false,
      "activeUser": null,
      "updatedAt": "2023-08-31T21:38:39.050Z",
      "isOutdated": true,
      "baseVersionNumber": "v.0.1.0",
      "isDevelopment": false
  }
]

export const mockTotalUnpublishedVersions = 2;

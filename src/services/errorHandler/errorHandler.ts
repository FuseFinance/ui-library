import { LockedWorkflowError } from './errorClases';

export const errorHandler = (error: any) => {
  console.error('ERROR', error);
  if (!error.response) throw error;

  const statusCode: number = error.response.status;
  switch (statusCode) {
    case 403:
      throw new LockedWorkflowError('Access denied', statusCode);
    case 404:
      throw new Error('Error 404: Not found');
    default:
      throw new Error('Unknown error');
  }
};

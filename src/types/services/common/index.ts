export interface CommonDataEntity {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export class CommonApiResponse {
  success: boolean;
  message: string;
}

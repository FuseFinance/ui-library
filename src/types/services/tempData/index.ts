/* eslint-disable @typescript-eslint/no-empty-interface */

import { CommonDataEntity } from '@/src/types/services/common';

export interface TempData extends CommonDataEntity {
  client: string;
  data: string;
}

import { CheckListRunStatusEnum } from '../redux/api';

export const IconSize = 20;
export const DateFormat = 'DD.MM.YYYY HH:mm';
export const DurationFormat = 'H [hours] m [minutes] s [seconds]';
export const defaultPagination = { page: 1, pageSize: 10 };
export const ChecklistRunStatuses: CheckListRunStatusEnum[] = [
  'STARTED',
  'CANCELED',
  'PAUSED',
  'FAILED',
  'PASSED',
];

import dayjs from 'dayjs';
import { DateFormat } from '@/settings/constants';

const formatDate = (data?: string): string => dayjs(data).format(DateFormat);

export default formatDate;

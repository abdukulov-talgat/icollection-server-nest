import * as dayjs from 'dayjs';

export const isExpired = (date: Date) => {
    return dayjs(date).isBefore(dayjs());
};

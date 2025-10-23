import { set } from "date-fns";

export const parseTime = (timeString: string): Date => {
    const timeSplit = timeString.split(':');
    return set(new Date(), { hours: parseInt(timeSplit[0]), minutes: parseInt(timeSplit[1]), seconds: 0 });
}

export const getDayOfWeekName = (dayOfWeek: number): string => {
    switch (dayOfWeek) {
        case 0:
            return 'Domingo';
        case 1:
            return 'Lunes';
        case 2:
            return 'Martes';
        case 3:
            return 'Miércoles';
        case 4:
            return 'Jueves';
        case 5:
            return 'Viernes';
        case 6:
            return 'Sábado';

        default:
            return '';
    }
};
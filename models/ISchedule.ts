import { ITimeRange } from "./ITimeRange";

export interface ISchedule {
    timeZone: string;
    daySchedules: { [key: number]: ITimeRange[] };
}
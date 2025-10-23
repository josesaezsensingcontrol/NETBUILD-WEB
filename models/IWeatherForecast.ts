import { IDataPoint } from "./IDataPoint";

export interface IWeatherForecast {
    temperature: IDataPoint[];
    humidity: IDataPoint[];
    directSolarRadiation: IDataPoint[];
}
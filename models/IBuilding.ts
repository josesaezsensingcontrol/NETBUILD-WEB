import { IDiagramConfig } from "./IDiagramConfig";
import { ISchedule } from "./ISchedule";
import { IWeatherForecast } from "./IWeatherForecast";

export interface IBuilding {
    id: string;
    neighborhoodId: string;
    ownerId: string;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    diagram?: IDiagramConfig;
    schedule?: ISchedule;
    weatherForecast?: IWeatherForecast;
}
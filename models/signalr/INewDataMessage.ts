export interface INewDataMessage {
    buildingId: string;
    systemId: string;
    dataInputs: { [key: string]: ITimestampedValue };
}

export interface ITimestampedValue {
    date: number;
    value: number;
}
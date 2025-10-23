import { IDataInput } from "./IDataInput";

export interface ISystem {
    id: string;
    buildingId: string,
    name: string;
    metadata: { [key: string]: string };
    dataInputs: IDataInput[];
}
import { IDataInput } from "../../IDataInput";

export interface IAddSystemRequest {
    systemId?: string | null;
    buildingId: string;
    name: string;
    dataInputs: IDataInput[];
    metadata: { [key: string]: string };
}
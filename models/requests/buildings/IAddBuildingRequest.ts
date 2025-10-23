export interface IAddBuildingRequest {
    ownerId: string;
    name: string;
    description: string | null;
    latitude: number;
    longitude: number;
}
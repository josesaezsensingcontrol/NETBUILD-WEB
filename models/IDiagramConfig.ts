import { IDiagramNode } from "./IDiagramNode";

export interface IDiagramConfig {
    imageUrl?: string;
    nodes?: IDiagramNode[];
}
import { Box, Stack } from "@mui/material";
import { IDiagramConfig } from "../../../models/IDiagramConfig";
import DataInputBox from "./DiagramNodeBox";
import { IDiagramNode } from "../../../models/IDiagramNode";
import { ISystem } from "../../../models/ISystem";

export type IDiagramPanelProps = {
    systems: ISystem[];
    diagram?: IDiagramConfig;
    selectedNodes?: IDiagramNode[];
    onSelectedNode: (node: IDiagramNode) => void;
};

export default function DiagramPanel({ systems, diagram, selectedNodes, onSelectedNode }: IDiagramPanelProps) {
    return (diagram?.imageUrl ?
        <Stack direction="column" width='100%' padding={2} spacing={1} sx={{ minHeight: '100%' }}>
            <Box component="div" sx={{ position: "relative" }}>
                {diagram?.nodes && diagram.nodes.map(node => {
                    return <DataInputBox
                        key={node.id}
                        systems={systems}
                        diagramNode={node}
                        editMode={false}
                        selected={selectedNodes?.find(x => x.id === node.id) !== undefined}
                        onSelected={(id) => onSelectedNode(diagram.nodes!.find(x => x.id === id)!)}
                    />
                })}

                <Box component="img" src={diagram.imageUrl} width='100%' height='100%' />
            </Box>
        </Stack>
        :
        null
    )
}
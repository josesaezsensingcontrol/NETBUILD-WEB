import { Box, Grid, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { ISystem } from "../../../models/ISystem";
import { IDiagramNode } from "../../../models/IDiagramNode";
import { IBuilding } from "../../../models/IBuilding";
import ChartPanel from "./ChartPanel";
import DiagramPanel from "./DiagramPanel";

export type IDiagramViewProps = {
    selectedBuilding: IBuilding;
    systems: ISystem[];
}

export default function DiagramView({ selectedBuilding, systems }: IDiagramViewProps) {
    const [selectedNodes, setSelectedNodes] = useState<IDiagramNode[]>([]);

    useEffect(() => {
        setSelectedNodes([]);
    }, [selectedBuilding]);

    const handleOnSelectedNode = (node: IDiagramNode) => {
        const index = selectedNodes.findIndex(x => x.id === node.id);
        if (index === -1) {
            setSelectedNodes([...selectedNodes, node])
        } else {
            setSelectedNodes([
                ...selectedNodes.slice(0, index),
                ...selectedNodes.slice(index + 1)
            ]);
        }
    };

    return (
        <Grid container width='100%'>
            <Grid item xs={6} paddingRight={1} mb={1}>
                <Paper elevation={4} sx={{ width: '100%', height: '100%', minHeight: "75vh" }} square>
                    <Box component="div" width='100%' height='100%'>
                        <DiagramPanel
                            systems={systems}
                            diagram={selectedBuilding.diagram}
                            selectedNodes={selectedNodes}
                            onSelectedNode={handleOnSelectedNode}
                        />
                    </Box>
                </Paper>
            </Grid>

            <Grid item xs={6}>
                <Paper elevation={4} sx={{ position: "sticky", top: '1rem', display: 'flex', width: '100%' }} square>
                    <ChartPanel
                        selectedBuilding={selectedBuilding}
                        selectedNodes={selectedNodes}
                    />
                </Paper>
            </Grid>
        </Grid>
    )
}
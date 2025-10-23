import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { ISystem } from "../../../models/ISystem";
import { IDiagramNode } from "../../../models/IDiagramNode";
import { evaluate as evaluateExpression } from "mathjs";

type DiagramNodeBoxProps = {
    systems: ISystem[];
    diagramNode: IDiagramNode;
    editMode: boolean;
    selected: boolean;
    onSelected: (diagramElementId: string) => void
    onDragStop?: (x: number, y: number) => void
}

const DiagramNodeBox = ({ systems, diagramNode, editMode, selected, onSelected, onDragStop }: DiagramNodeBoxProps) => {
    const resolveExpression = (expression: string) => {
        let deTokenizedExpression = expression;
        systems.forEach(system => {
            system.dataInputs.forEach(dataInput => {
                if (dataInput.value !== null && dataInput.value !== undefined) {
                    deTokenizedExpression = deTokenizedExpression.replaceAll(`{${system.id}:${dataInput.id}}`, dataInput.value.toString());
                }
            });
        });

        try {
            const value = evaluateExpression(deTokenizedExpression);
            return value !== null && value !== undefined && value !== "" && !isNaN(value) && isFinite(value) ? `${value.toFixed(2)} ${diagramNode.units}` : diagramNode.name;
        } catch (e) {
            return "SIN VALOR";
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleOnStart = (_event: DraggableEvent, _data: DraggableData) => {
        setDragging(true);
    };

    const handleOnStop = (event: DraggableEvent, data: DraggableData) => {
        setDragging(false);
        if (onDragStop && event.target) {
            onDragStop(data.x, data.y);
        }
    };

    const [isDragging, setDragging] = useState(false);

    const updateTimer = useRef<NodeJS.Timeout | null>(null);
    const [highlight, setHighlight] = useState(false);

    const resolvedExpression = resolveExpression(diagramNode.expression);

    const [mountTime] = useState(new Date().getTime());
    useEffect(() => {
        return () => {
            if (updateTimer.current) {
                clearTimeout(updateTimer.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!editMode && !updateTimer.current && ((new Date().getTime() - mountTime) > 500)) {
            setHighlight(true);

            updateTimer.current = setTimeout(() => {
                setHighlight(false);
                updateTimer.current = null;
            }, 1000);
        }
    }, [mountTime, resolvedExpression, editMode]);

    return (
        <Draggable
            bounds="parent"
            position={{ x: 0, y: 0 }}
            onStart={handleOnStart}
            onStop={handleOnStop}
            onMouseDown={() => onSelected(diagramNode.id)}
            disabled={!editMode}
        >
            {editMode ?
                <Box component="div"
                    sx={{
                        position: "absolute",
                        left: `${diagramNode.x}%`,
                        top: `${diagramNode.y}%`,
                        minWidth: '80px',
                        backgroundColor: selected ? "#5c6fb8" : "#0a416e",
                        cursor: isDragging ? "grabbing" : "grab"
                    }}
                    zIndex={10}
                >
                    <Typography align="center" padding={1} color="white">{diagramNode.name}</Typography>
                </Box>
                :
                <Tooltip title={diagramNode.name} placement="top" arrow>
                    <Stack direction="column"
                        sx={{
                            position: "absolute",
                            left: `${diagramNode.x}%`,
                            top: `${diagramNode.y}%`,
                            minWidth: '80px',
                            cursor: isDragging ? "grabbing" : "grab",
                            backgroundColor: highlight ? "#ffb804" : selected ? "#5c6fb8" : "#0a416e"
                        }}
                        zIndex={10}
                    >
                        <Typography variant="body2" align="center" padding={1} color="white">{resolvedExpression}</Typography>
                    </Stack>
                </Tooltip>
            }
        </Draggable >
    );
}

export default DiagramNodeBox;
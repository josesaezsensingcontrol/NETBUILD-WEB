import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useUpdateBuildingDiagramImageMutation, useUpdateBuildingDiagramNodesMutation } from "../../../features/api/apiSlice";
import useDimensions from "react-cool-dimensions";
import DataInputBox from "./DiagramNodeBox";
import { IDiagramConfig } from "../../../models/IDiagramConfig";
import { IBuilding } from "../../../models/IBuilding";
import AddNodeDialog from "../../Dialogs/Buildings/AddNodeDialog";

import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";
import NodesList from "./NodesList";
import { IDiagramNode } from "../../../models/IDiagramNode";
import GenericDeleteDialog from "../../Dialogs/GenericDeleteDialog";
import EditNodeDialog from "../../Dialogs/Buildings/EditNodeDialog";
import { ISystem } from "../../../models/ISystem";
import { Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { fileToBase64 } from "../../../helpers/FileHelper";

const imageMimeType = /image\/(png|jpg|jpeg|svg)/i;

export type IEditDiagramProps = {
    selectedBuilding: IBuilding;
    systems: ISystem[],
    onEditCompleted: () => void;
}

export default function EditDiagramView({ selectedBuilding, systems, onEditCompleted }: IEditDiagramProps) {
    const [updateBuildingDiagramImage] = useUpdateBuildingDiagramImageMutation();
    const [updateBuildingDiagramNodes] = useUpdateBuildingDiagramNodesMutation();

    const [file, setFile] = useState<File | null>(null);
    const [fileDataURL, setFileDataURL] = useState<string | null>(null);

    const [diagram, setDiagram] = useState<IDiagramConfig>({ imageUrl: undefined, nodes: undefined });

    const [selectedNode, setSelectedNode] = useState<IDiagramNode | null>(null);

    const [openAddNodeDialog, setOpenAddNodeDialog] = useState(false);
    const [openEditNodeDialog, setOpenEditNodeDialog] = useState(false);
    const [openDeleteNodeDialog, setOpenDeleteNodeDialog] = useState(false);

    const handleAddNode = (name: string, expression: string, units: string) => {
        if (diagram.nodes) {
            setDiagram({ ...diagram, nodes: [...diagram.nodes, { id: uuidv4(), name, x: 0, y: 0, expression, units }] })
        } else {
            setDiagram({ ...diagram, nodes: [{ id: uuidv4(), name, x: 0, y: 0, expression, units }] })
        }
    };

    const handleEditNodeClick = (node: IDiagramNode) => {
        setSelectedNode(node);
        setOpenEditNodeDialog(true);
    };

    const handleCloseEditNodeDialog = () => {
        setOpenEditNodeDialog(false);
        setSelectedNode(null);
    };

    const handleEditNode = (node: IDiagramNode) => {
        setDiagram({ ...diagram, nodes: diagram.nodes?.map((x) => x.id !== node.id ? x : node) ?? [] })
    };

    const handleDeleteNodeClick = (node: IDiagramNode) => {
        setSelectedNode(node);
        setOpenDeleteNodeDialog(true);
    };

    const handleCloseDeleteNodeDialog = () => {
        setOpenDeleteNodeDialog(false);
        setSelectedNode(null);
    };

    const handleDeleteNode = (node: IDiagramNode) => {
        setOpenDeleteNodeDialog(false);
        setDiagram({ ...diagram, nodes: diagram.nodes?.filter(x => x.id !== node.id) })
        setSelectedNode(null);
    };

    const handleDragStop = (id: string, x: number, y: number) => {
        setDiagram({
            ...diagram,
            nodes: diagram.nodes?.map((node) => {
                if (node.id === id) {
                    return { ...node, x: node.x + (x / width * 100), y: node.y + (y / height * 100) };
                } else {
                    return node;
                }
            })
        });
    };

    const handleSave = async () => {
        if (file && fileDataURL) {
            await updateBuildingDiagramImage(
                {
                    buildingId: selectedBuilding.id,
                    neighborhoodId: selectedBuilding.neighborhoodId,
                    updateBuildingDiagramImage: {
                        fileName: file.name,
                        image: await fileToBase64(file)
                    }
                }
            ).unwrap();
        }

        if (diagram.nodes) {
            updateBuildingDiagramNodes({ buildingId: selectedBuilding.id, neighborhoodId: selectedBuilding.neighborhoodId, updateBuildingDiagramNodes: { nodes: diagram.nodes } })
        }

        toast("Cambios guardados!", { type: "success" })
        onEditCompleted();
    }

    const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            if (!file.type.match(imageMimeType)) {
                alert("Image mime type is not valid");
                return;
            }

            setFile(file);
        }
    }

    useEffect(() => {
        let fileReader: FileReader;
        let isCancel = false;
        if (file) {
            fileReader = new FileReader();
            fileReader.onload = (e) => {
                const { result } = e.target!;
                if (result && !isCancel) {
                    setFileDataURL(result as string);
                }
            }
            fileReader.readAsDataURL(file);
        }

        return () => {
            isCancel = true;
            if (fileReader && fileReader.readyState === 1) {
                fileReader.abort();
            }
        }
    }, [file]);

    useEffect(() => {
        if (selectedBuilding?.diagram) {
            setDiagram(selectedBuilding.diagram)
        }
    }, [selectedBuilding]);

    const { observe, width, height } = useDimensions()

    return (
        <>
            <Stack direction="row" spacing={2} sx={{ my: 1 }}>
                <Button variant="contained" component="label">
                    Cambiar Imagen
                    <input hidden accept=".png, .jpg, .jpeg, .svg" type="file" onChange={changeImageHandler} />
                </Button>
                <Button variant="contained" onClick={() => setOpenAddNodeDialog(true)}>Añadir Nodo</Button>
                <Button variant="contained" color="error" endIcon={<CancelIcon />} onClick={() => onEditCompleted()}>Cancelar</Button>
                <Button variant="contained" endIcon={<SaveIcon />} onClick={handleSave}>Guardar</Button>
            </Stack>
            <Stack direction="row" spacing={5}>
                <Paper elevation={4} sx={{ width: '70%', height: '100%', minHeight: "80vh", mb: 1 }} square>
                    <Stack direction="column" width='100%' height='100%' padding={2} spacing={1}>
                        {(fileDataURL || diagram?.imageUrl) &&
                            <Box component="div" sx={{ position: "relative" }}>
                                {diagram && diagram.nodes && diagram.nodes.map(node => {
                                    return <DataInputBox
                                        key={node.id}
                                        systems={systems}
                                        diagramNode={node}
                                        editMode={true}
                                        selected={selectedNode?.id === node.id}
                                        onSelected={(id) => setSelectedNode(diagram.nodes?.find(x => x.id === id) ?? null)}
                                        onDragStop={(x, y) => handleDragStop(node.id, x, y)}
                                    />
                                })}

                                <Box component="img" src={fileDataURL ? fileDataURL : selectedBuilding?.diagram?.imageUrl} width='100%' height='100%' ref={observe} />
                            </Box>
                        }
                    </Stack>
                </Paper>

                <Paper elevation={4} sx={{ width: '30%', height: '100%', minHeight: '80vh' }} square>
                    <Stack direction="column" width='100%' height='100%' padding={2} spacing={1}>
                        <Typography variant="h5" fontWeight="bold">Nodos</Typography>
                        <NodesList
                            nodes={diagram.nodes}
                            selectedNode={selectedNode}
                            onSelectedNode={(node) => setSelectedNode(node)}
                            onEditNode={handleEditNodeClick}
                            onDeleteNode={handleDeleteNodeClick}
                            isLoading={false}
                        />
                    </Stack>
                </Paper>
            </Stack>

            {openAddNodeDialog && <AddNodeDialog systems={systems} openDialog={openAddNodeDialog} handleClose={() => setOpenAddNodeDialog(false)} handleAddNode={handleAddNode} />}
            {openEditNodeDialog && selectedNode && <EditNodeDialog systems={systems} node={selectedNode} openDialog={openEditNodeDialog} handleClose={handleCloseEditNodeDialog} handleEditNode={handleEditNode} />}

            {openDeleteNodeDialog && selectedNode &&
                <GenericDeleteDialog
                    openDialog={openDeleteNodeDialog}
                    handleClose={handleCloseDeleteNodeDialog}
                    title={`Quieres eliminar ${selectedNode.name}?`}
                    message=""
                    handleDelete={() => handleDeleteNode(selectedNode)}
                />
            }
        </>
    );
}
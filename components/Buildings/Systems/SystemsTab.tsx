import { Button, CircularProgress, Grid, IconButton, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridColumnHeaderParams, GridRowsProp } from "@mui/x-data-grid";
import { Fragment, useState } from "react";
import { useAddSystemMutation, useDeleteSystemMutation, useGetBuildingSystemsQuery, useUpdateSystemMutation } from "../../../features/api/apiSlice";
import { ISystem } from "../../../models/ISystem";
import { IDataInput } from "../../../models/IDataInput";
import AddSystemDialog from "../../Dialogs/Systems/AddSystemDialog";
import GenericDeleteDialog from "../../Dialogs/GenericDeleteDialog";
import { Edit as EditIcon, Delete as DeleteIcon, Info as InfoIcon } from "@mui/icons-material";
import { useAppSelector } from "../../../app/hooks";
import { selectCurrentUser } from "../../../features/auth/authSlice";
import { hasOwnerRights } from "../../../helpers/PermissionsHelper";
import { IBuilding } from "../../../models/IBuilding";
import MetadataDialog from "../../Dialogs/Systems/MetadataDialog";
import UpdateSystemDialog from "../../Dialogs/Systems/UpdateSystemDialog";

type SystemsTabProps = {
    building: IBuilding;
}

export default function SystemsTab({ building }: SystemsTabProps) {
    const authUser = useAppSelector(selectCurrentUser);

    const { data: systems, isLoading: isLoadingSystems } = useGetBuildingSystemsQuery({ neighborhoodId: building?.neighborhoodId, buildingId: building?.id });

    const [selectedSystem, setSelectedSystem] = useState<ISystem | null>(null);

    const [addSystem, addSystemResult] = useAddSystemMutation();
    const [updateSystem, updateSystemResult] = useUpdateSystemMutation();
    const [deleteSystem, deleteSystemResult] = useDeleteSystemMutation();

    const [showMetadataDialog, setShowMetadataDialog] = useState(false);

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleAddSystem = (name: string, dataInputs: IDataInput[], metadata: { [key: string]: string }, systemId?: string | null) => {
        setOpenAddDialog(false);
        addSystem({ systemId: systemId, buildingId: building.id, name, dataInputs, metadata });
    }

    const handleUpdateSystem = (systemId: string, name: string) => {
        setOpenUpdateDialog(false);
        updateSystem({ systemId, updateSystem: { buildingId: building.id, name } })
    };

    const handleDeleteSystem = (systemId: string) => {
        setOpenDeleteDialog(false);
        deleteSystem({ systemId, deleteSystem: { buildingId: building.id, neighborhoodId: building.neighborhoodId } })
    };

    const handleInfoClick = (systemId: string) => {
        setSelectedSystem(systems?.find((c) => c.id === systemId) ?? null);
        setShowMetadataDialog(true);
    };

    const handleUpdateClick = (systemId: string) => {
        setSelectedSystem(systems?.find((c) => c.id === systemId) ?? null);
        setOpenUpdateDialog(true);
    };

    const handleCloseUpdateDialog = () => {
        setOpenUpdateDialog(false);
        setSelectedSystem(null);
    };

    const handleDeleteClick = (systemId: string) => {
        setSelectedSystem(systems?.find((c) => c.id === systemId) ?? null);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedSystem(null);
    };

    const columns: GridColDef[] = [
        {
            field: 'idCol',
            headerName: 'Identificador',
            flex: 1.2,
            renderHeader: (params: GridColumnHeaderParams) => (<strong>{params.colDef.headerName}</strong>)
        },
        {
            field: 'nameCol',
            headerName: 'Nombre',
            flex: 0.8,
            renderHeader: (params: GridColumnHeaderParams) => (<strong>{params.colDef.headerName}</strong>)
        },
        {
            field: 'dataCol',
            headerName: 'Datos',
            flex: 3,
            renderCell: (params) => {
                return (
                    <Grid container columnSpacing={1}>
                        {params.row.dataCol.map((dataInput: IDataInput) => {
                            return (
                                <Fragment key={`${params.row.idCol}:${dataInput.id}`}>
                                    <Grid item xs={2}>
                                        <Stack direction="row" spacing={1}>
                                            <Typography fontWeight="bold">Id:</Typography>
                                            <Typography sx={{ wordBreak: "break-all" }}>{dataInput.id}</Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Stack direction="row" spacing={1}>
                                            <Typography fontWeight="bold">Nombre:</Typography>
                                            <Typography sx={{ wordBreak: "break-all" }}>{dataInput.name}</Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack direction="row" spacing={1}>
                                            <Typography fontWeight="bold">Valor:</Typography>
                                            <Typography>{dataInput.value !== null && dataInput.value !== undefined && !isNaN(dataInput.value) && isFinite(dataInput.value) ? `${dataInput.value.toFixed(2)} ${dataInput.units}` : ""} {dataInput.date ? `(${new Date(dataInput.date).toLocaleString()})   ` : ""}</Typography>
                                        </Stack>
                                    </Grid>
                                </Fragment>
                            )
                        })
                        }
                    </Grid>
                )
            },
            renderHeader: (params: GridColumnHeaderParams) => (<strong>{params.colDef.headerName}</strong>)
        },
        ...(hasOwnerRights(authUser, building) ? [{
            field: 'actionsCol',
            headerName: 'Acciones',
            width: 150,
            renderCell: (params) => {
                return (
                    <Stack direction="row">
                        <IconButton onClick={() => handleInfoClick(params.row.idCol)}>
                            <InfoIcon />
                        </IconButton>
                        <IconButton onClick={() => handleUpdateClick(params.row.idCol)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(params.row.idCol)}>
                            <DeleteIcon />
                        </IconButton>
                    </Stack>
                )
            },
            renderHeader: (params: GridColumnHeaderParams) => (<strong>{params.colDef.headerName}</strong>)
        } as GridColDef] : [])
    ];

    const rows: GridRowsProp = systems ?
        systems.map((system) => {
            return {
                id: system.id,
                idCol: system.id,
                nameCol: system.name,
                dataCol: system.dataInputs ?? "SIN DATOS"
            }
        })
        :
        [];

    return (
        <Grid container display="flex" direction="row" alignItems="center" justifyContent="center" width='100%' rowSpacing={1}>
            {isLoadingSystems || addSystemResult.isLoading || updateSystemResult.isLoading || deleteSystemResult.isLoading ?
                <Grid item display="flex" xs={12} minHeight="70vh" alignItems="center" justifyContent="center">
                    <CircularProgress />
                </Grid>
                :
                <>
                    <Grid item display="flex" justifyContent="end" xs={12} sx={{ mr: 1 }}>
                        {hasOwnerRights(authUser, building) &&
                            <Button variant="contained" onClick={() => setOpenAddDialog(true)}>Añadir Sistema</Button>
                        }
                    </Grid>

                    {systems?.length === 0 ?
                        <Grid item display="flex" xs={12} minHeight="70vh" alignItems="center" justifyContent="center">
                            <Typography variant="h6">
                                Este edificio no tiene sistemas
                            </Typography>
                        </Grid>
                        :
                        <Grid item xs={12} sx={{ mx: 1 }}>
                            <DataGrid
                                autoHeight
                                getRowHeight={() => 'auto'}
                                columns={columns}
                                rows={rows}
                                disableColumnMenu
                                disableRowSelectionOnClick
                                hideFooter
                            />
                        </Grid>
                    }
                </>
            }

            {showMetadataDialog && selectedSystem &&
                <MetadataDialog
                    openDialog={showMetadataDialog}
                    handleClose={() => setShowMetadataDialog(false)}
                    metadata={selectedSystem.metadata}
                />
            }

            {openAddDialog &&
                <AddSystemDialog
                    openDialog={openAddDialog}
                    handleClose={() => setOpenAddDialog(false)}
                    handleAddSystem={handleAddSystem}
                />
            }
            {openUpdateDialog && selectedSystem &&
                <UpdateSystemDialog
                    openDialog={openUpdateDialog}
                    handleClose={handleCloseUpdateDialog}
                    system={selectedSystem}
                    handleUpdateSystem={handleUpdateSystem} />
            }
            {openDeleteDialog && selectedSystem &&
                <GenericDeleteDialog
                    openDialog={openDeleteDialog}
                    handleClose={handleCloseDeleteDialog}
                    title={`Quieres eliminar el sistema ${selectedSystem.name} con Identificador ${selectedSystem.id} ?`}
                    message="Esta acción no es reversible. Se perderán todos los datos históricos y predicciones asociados a este sistema."
                    handleDelete={() => handleDeleteSystem(selectedSystem.id)}
                />
            }
        </Grid>
    )
}
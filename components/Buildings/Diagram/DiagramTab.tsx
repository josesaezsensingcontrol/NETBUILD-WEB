import { Button, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import EditDiagramView from "./EditDiagramView";
import { IBuilding } from "../../../models/IBuilding";
import DiagramView from "./DiagramView";
import { selectCurrentUser } from "../../../features/auth/authSlice";
import { hasOwnerRights } from "../../../helpers/PermissionsHelper";
import { useAppSelector } from "../../../app/hooks";
import { useGetBuildingSystemsQuery } from "../../../features/api/apiSlice";

export type IDiagramTabProps = {
    building: IBuilding;
}

export default function DiagramTab({ building }: IDiagramTabProps) {
    const authUser = useAppSelector(selectCurrentUser);

    const { data: systems } = useGetBuildingSystemsQuery({ neighborhoodId: building?.neighborhoodId, buildingId: building?.id });

    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        setEditMode(false);
    }, [building])

    return (
        <Grid container display="flex" rowSpacing={1} direction="row" alignItems="center" justifyContent="center" width='100%' >
            {!editMode && building.diagram?.imageUrl &&
                <Grid item display="flex" justifyContent="end" xs={12} sx={{ mr: 1 }}>
                    {hasOwnerRights(authUser, building) &&
                        <Button variant="contained" onClick={() => setEditMode(true)}>Editar Diagrama</Button>
                    }
                </Grid>
            }
            <Grid item md={12} sx={{ mx: 1 }}>
                {editMode ?
                    <EditDiagramView
                        selectedBuilding={building}
                        systems={systems ?? []}
                        onEditCompleted={() => setEditMode(false)}
                    />
                    :
                    (building.diagram?.imageUrl) ?
                        <DiagramView
                            selectedBuilding={building}
                            systems={systems ?? []}
                        />
                        :
                        <Grid item display="flex" xs={12} minHeight="70vh" alignItems="center" justifyContent="center">
                            <Stack direction="column" spacing={1} alignItems="center">
                                <Typography variant="h6">
                                    Todavía no has configurado el diagrama
                                </Typography>
                                {hasOwnerRights(authUser, building) &&
                                    <Button variant="contained" onClick={() => setEditMode(true)} sx={{ width: '150px' }}>Configurar</Button>
                                }
                            </Stack>
                        </Grid>
                }
            </Grid>
        </Grid >
    );
}
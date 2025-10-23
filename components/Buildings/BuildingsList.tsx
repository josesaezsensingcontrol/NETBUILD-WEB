import { CircularProgress, IconButton, List, ListItemButton, ListItemIcon, ListItemSecondaryAction, ListItemText } from "@mui/material";
import { Stack } from "@mui/system";
import { IBuilding } from "../../models/IBuilding";
import { Delete as DeleteIcon, LocationCity as BuildingIcon, Edit as EditIcon } from "@mui/icons-material";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { isSuperAdmin } from "../../helpers/PermissionsHelper";

type BuildingsListProps = {
    buildings?: IBuilding[],
    selectedBuilding?: IBuilding | null | undefined,
    onSelectedBuilding: (building: IBuilding) => void,
    onEditBuildingClick: (building: IBuilding) => void,
    onDeleteBuildingClick: (building: IBuilding) => void,
    isLoading: boolean
}

export default function BuildingsList({ buildings, selectedBuilding, onSelectedBuilding, onEditBuildingClick, onDeleteBuildingClick, isLoading }: BuildingsListProps) {
    const authUser = useAppSelector(selectCurrentUser);

    const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>, building: IBuilding) => {
        event.stopPropagation();
        onEditBuildingClick(building);
    }

    const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>, building: IBuilding) => {
        event.stopPropagation();
        onDeleteBuildingClick(building);
    }

    return (
        isLoading ?
            <Stack height='100%' alignItems="center" justifyContent="center">
                <CircularProgress />
            </Stack>
            :
            <Stack direction="column">
                <List sx={{ maxHeight: '100%', overflow: 'auto' }}>
                    {
                        buildings?.map(building =>
                            <ListItemButton
                                key={building.id}
                                selected={building.id === selectedBuilding?.id}
                                onClick={() => onSelectedBuilding(building)}
                                autoFocus={building.id === selectedBuilding?.id}
                                disableRipple
                                sx={{ mb: 1 }}
                            >
                                <ListItemIcon>
                                    <BuildingIcon />
                                </ListItemIcon>
                                <ListItemText primary={building.name} secondary={building.description} />
                                {isSuperAdmin(authUser) &&
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="edit" onClick={(e) => handleEditClick(e, building)} sx={{ mx: '1px' }}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete" onClick={(e) => handleDeleteClick(e, building)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                }
                            </ListItemButton>
                        )
                    }
                </List>
            </Stack>
    )
}
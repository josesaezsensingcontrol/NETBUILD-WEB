import { CircularProgress, IconButton, List, ListItemButton, ListItemIcon, ListItemSecondaryAction, ListItemText } from "@mui/material";
import { Stack } from "@mui/system";
import { Edit as EditIcon, Delete as DeleteIcon, Groups3 as NeighborhoodIcon } from "@mui/icons-material";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { INeighborhood } from "../../models/INeighborhood";
import { isSuperAdmin } from "../../helpers/PermissionsHelper";

type NeighborhoodsListProps = {
    neighborhoods?: INeighborhood[],
    selectedNeighborhood?: INeighborhood | null | undefined,
    onSelectedNeighborhood: (neighborhood: INeighborhood) => void,
    onEditNeighborhoodClick: (neighborhood: INeighborhood) => void,
    onDeleteNeighborhoodClick: (neighborhood: INeighborhood) => void,
    isLoading: boolean
}

export default function NeighborhoodsList({ neighborhoods, selectedNeighborhood, onSelectedNeighborhood, onEditNeighborhoodClick, onDeleteNeighborhoodClick, isLoading }: NeighborhoodsListProps) {
    const authUser = useAppSelector(selectCurrentUser);

    const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>, neighborhood: INeighborhood) => {
        event.stopPropagation();
        onEditNeighborhoodClick(neighborhood);
    }

    const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>, neighborhood: INeighborhood) => {
        event.stopPropagation();
        onDeleteNeighborhoodClick(neighborhood);
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
                        neighborhoods?.map(neighborhood =>
                            <ListItemButton
                                key={neighborhood.id}
                                selected={neighborhood.id === selectedNeighborhood?.id}
                                onClick={() => onSelectedNeighborhood(neighborhood)}
                                autoFocus={neighborhood.id === selectedNeighborhood?.id}
                                disableRipple
                                sx={{ mb: 1 }}
                            >
                                <ListItemIcon>
                                    <NeighborhoodIcon />
                                </ListItemIcon>
                                <ListItemText primary={neighborhood.name} secondary={neighborhood.description} />
                                {isSuperAdmin(authUser) &&
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="edit" onClick={(e) => handleEditClick(e, neighborhood)} sx={{ mx: '1px' }}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete" onClick={(e) => handleDeleteClick(e, neighborhood)}>
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
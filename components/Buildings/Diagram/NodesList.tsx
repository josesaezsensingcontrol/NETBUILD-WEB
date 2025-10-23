import { SearchOutlined } from "@mui/icons-material";
import { CircularProgress, IconButton, List, ListItemButton, ListItemSecondaryAction, ListItemText, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useState } from "react";
import { IDiagramNode } from "../../../models/IDiagramNode";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

type NodesListProps = {
    nodes?: IDiagramNode[] | null | undefined,
    selectedNode?: IDiagramNode | null | undefined,
    onSelectedNode: (node: IDiagramNode) => void,
    onEditNode: (node: IDiagramNode) => void,
    onDeleteNode: (node: IDiagramNode) => void,
    isLoading: boolean
}

export default function NodesList({ nodes, selectedNode, onSelectedNode, onEditNode, onDeleteNode, isLoading }: NodesListProps) {
    const [filter, setFilter] = useState("");

    const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>, node: IDiagramNode) => {
        event.stopPropagation();
        onSelectedNode(node);
        onEditNode(node);
    };

    const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>, node: IDiagramNode) => {
        event.stopPropagation();
        onSelectedNode(node);
        onDeleteNode(node);
    }

    return (
        isLoading ?
            <Stack height='100%' alignItems="center" justifyContent="center">
                <CircularProgress />
            </Stack>
            :
            <Stack direction="column">
                <TextField
                    variant="outlined"
                    placeholder="Filtro"
                    InputProps={{
                        startAdornment: (
                            <IconButton>
                                <SearchOutlined />
                            </IconButton>
                        ),
                    }}
                    value={filter}
                    onChange={(event) => { setFilter(event.target.value) }}
                    size="small"
                />
                <List sx={{ maxHeight: '100%', overflow: 'auto' }}>
                    {
                        nodes?.filter(node =>
                            node.name.includes(filter) ||
                            node.id.includes(filter)
                        ).map(node =>
                            <ListItemButton
                                key={node.id}
                                selected={node.id === selectedNode?.id}
                                onClick={() => onSelectedNode(node)}
                                disableRipple
                                sx={{
                                    my: "2px",
                                    "&.Mui-selected": {
                                        backgroundColor: "#d6d6d6"
                                    },
                                    "&.Mui-selected:hover": {
                                        backgroundColor: "#d6d6d6"
                                    },
                                    ":hover": {
                                        backgroundColor: "#b6b6b6"
                                    }
                                }}
                            >
                                <ListItemText>{node.name}</ListItemText>

                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="edit" onClick={(e) => handleEditClick(e, node)} sx={{ mx: '1px' }}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={(e) => handleDeleteClick(e, node)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItemButton>
                        )
                    }
                </List>
            </Stack>
    )
}
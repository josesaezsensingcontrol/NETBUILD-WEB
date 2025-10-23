import { SearchOutlined } from "@mui/icons-material";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { ChangeEvent, useEffect, useState } from "react";
import GenericDeleteDialog from "../../components/Dialogs/GenericDeleteDialog";
import AddUserDialog from "../../components/Dialogs/Users/AddUserDialog";
import UpdateUserDialog from "../../components/Dialogs/Users/UpdateUserDialog";
import User from "../../components/User/User";
import { IUser, UserRole } from "../../models/IUser";
import { Typography } from "@mui/material";
import { useAppSelector } from '../../app/hooks';
import { useAddUserMutation, useDeleteUserMutation, useGetAllUsersQuery, useUpdateUserMutation } from "../../features/api/apiSlice";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { isSuperAdmin } from "../../helpers/PermissionsHelper";

export default function UsersPage() {
    const authUser = useAppSelector(selectCurrentUser);

    const [filter, setFilter] = useState<string>("");
    const [selectableUsers, setSelectableUsers] = useState<IUser[]>([]);
    const { data: users, isLoading, isFetching } = useGetAllUsersQuery()

    const [addUser, addUserResult] = useAddUserMutation();
    const [updateUser, updateUserResult] = useUpdateUserMutation();
    const [deleteUser, deleteUserResult] = useDeleteUserMutation();

    const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);

    const handleAddUser = (firstName: string, lastName: string, email: string, password: string, parentId: string | null, role: UserRole | null) => {
        setOpenAddDialog(false);
        addUser({ firstName, lastName, email, password, parentId, role });
    };

    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

    const handleFilterChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void = (event) => {
        setFilter(event.target.value);
    };

    const handleEditClick = (user: IUser) => {
        setSelectedUser(user);
        setOpenUpdateDialog(true);
    };

    const handleCloseUpdateDialog = () => {
        setOpenUpdateDialog(false);
        setSelectedUser(null);
    };

    const handleUpdateUser = (userId: string, firstName: string, lastName: string, email: string, password: string | null) => {
        setOpenUpdateDialog(false);
        updateUser({ userId, updateUser: { firstName, lastName, email, password } });
    };

    const handleDeleteClick = (user: IUser) => {
        setSelectedUser(user);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedUser(null);
    };

    const handleDeleteUser = (userId: string) => {
        setOpenDeleteDialog(false);
        deleteUser(userId);
    };

    useEffect(() => {
        if (isSuperAdmin(authUser) && users) {
            const newSelectableUsers = [...users].filter(u => u.role === UserRole.Admin);
            newSelectableUsers.unshift(authUser!);
            setSelectableUsers(newSelectableUsers);
        }
    }, [users, authUser]);

    return (
        <>
            <Grid container display="flex" spacing={1} direction="row" alignItems="center" justifyContent="center" width='100%' sx={{ mt: 1 }}>
                <Grid item xs={12} sx={{ mx: 1 }} >
                    <Typography variant="h4">
                        Usuarios
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ mx: 1 }} >
                    <Stack direction="row" alignItems="center">
                        <TextField
                            id="standard-bare"
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
                            onChange={handleFilterChange}
                            size="small"
                        />
                        <Button variant="contained" onClick={() => setOpenAddDialog(true)} sx={{ ml: 1, mt: 1, mb: 1 }}>Añadir Usuario</Button>
                    </Stack>
                </Grid>
                <>
                    {users?.length === 0 &&
                        <Grid item display="flex" xs={12} minHeight="70vh" alignItems="center" justifyContent="center">
                            <Typography variant="h6">
                                No tienes ningún usuario
                            </Typography>
                        </Grid>
                    }
                    {users && users.length > 0 &&
                        users
                            .filter((user) => user.firstName?.includes(filter) ||
                                user.id.includes(filter)
                            ).map((user) =>
                                <Grid key={user.id} item xs={12} sm={8} md={3} sx={{ ml: 1 }}>
                                    <User user={user} onEditClick={() => handleEditClick(user)} onDeleteClick={() => handleDeleteClick(user)} />
                                </Grid>
                            )
                    }
                </>
            </Grid >

            {openAddDialog && <AddUserDialog selectableUsers={selectableUsers} openDialog={openAddDialog} handleClose={() => setOpenAddDialog(false)} handleAddUser={handleAddUser} />}

            {openUpdateDialog && selectedUser && <UpdateUserDialog openDialog={openUpdateDialog} handleClose={handleCloseUpdateDialog} handleUpdateUser={handleUpdateUser} user={selectedUser} />}

            {openDeleteDialog && selectedUser &&
                <GenericDeleteDialog
                    openDialog={openDeleteDialog}
                    handleClose={handleCloseDeleteDialog}
                    title={`Quieres eliminar ${selectedUser.firstName + " " + selectedUser.lastName} con Id ${selectedUser.id} ?`}
                    message="Está acción no es reversible"
                    handleDelete={() => handleDeleteUser(selectedUser.id)}
                />
            }

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading || (isFetching && users?.length === 0) || addUserResult.isLoading || updateUserResult.isLoading || deleteUserResult.isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}
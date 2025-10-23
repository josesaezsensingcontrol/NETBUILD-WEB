import { VisibilityOff, Visibility } from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, IconButton, InputAdornment, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import { MouseEvent, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { getRoleName } from "../../../helpers/UserExtensions";
import { IUser, UserRole } from "../../../models/IUser";

export type IAddUserDialogProps = {
    openDialog: boolean;
    selectableUsers?: IUser[];
    handleClose: () => void;
    handleAddUser: (firstName: string, lastName: string, email: string, password: string, parentId: string | null, role: UserRole | null) => void;
};

export default function AddUserDialog({ openDialog, selectableUsers, handleClose, handleAddUser }: IAddUserDialogProps) {
    const { handleSubmit, watch, control, setValue } = useForm();
    const watchRole = watch("role", UserRole.Admin);

    function onSubmit(data: FieldValues) {
        const parentId = data.parentId === undefined ? null : data.parentId
        const role = data.role === undefined ? null : data.role;
        handleAddUser(data.firstName, data.lastName, data.email, data.password, parentId, role);
        handleClose();
    }

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleClickShowPassword: () => void = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword: (event: MouseEvent) => void = (event) => {
        event.preventDefault();
    };

    const handleAddDialogClose: (event: object | null, reason: "backdropClick" | "escapeKeyDown" | null) => void = (_event, reason) => {
        if (reason && reason === "backdropClick") {
            return;
        }

        handleClose();
    };

    return (
        <Dialog
            open={openDialog}
            onClose={handleAddDialogClose}
        >
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>Add User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Fill the following fields to add a new user
                    </DialogContentText>
                    <Controller
                        name="firstName"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: "Campo requerido"
                        }}
                        render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                            <TextField
                                autoFocus
                                margin="normal"
                                label="Nombre"
                                type="text"
                                fullWidth
                                variant="outlined"
                                required
                                value={value}
                                onChange={onChange}
                                error={invalid}
                                helperText={error ? error.message : ""}
                            />
                        )}
                    />

                    <Controller
                        name="lastName"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: "Campo requerido"
                        }}
                        render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                            <TextField
                                margin="normal"
                                label="Apellidos"
                                type="text"
                                fullWidth
                                variant="outlined"
                                required
                                value={value}
                                onChange={onChange}
                                error={invalid}
                                helperText={error ? error.message : ""}
                            />
                        )}
                    />

                    <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: "Campo requerido",
                            pattern: {
                                // eslint-disable-next-line no-useless-escape
                                value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: "Por favor introduce una dirección válida"
                            }
                        }}
                        render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                            <TextField
                                margin="normal"
                                label="Correo Electrónico"
                                type="email"
                                fullWidth
                                variant="outlined"
                                required
                                value={value}
                                onChange={onChange}
                                error={invalid}
                                helperText={error ? error.message : ""}
                            />
                        )}
                    />

                    <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: "Campo requerido"
                        }}
                        render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                            <TextField
                                margin="normal"
                                label="Contraseña"
                                type={showPassword ? "text" : "password"}
                                fullWidth
                                variant="outlined"
                                required
                                value={value}
                                onChange={onChange}
                                error={invalid}
                                helperText={error ? error.message : ""}
                                InputProps={{
                                    endAdornment:
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                }}
                            />
                        )}
                    />
                    {selectableUsers && selectableUsers.length > 0 &&
                        <>
                            <Controller
                                name="role"
                                control={control}
                                defaultValue={UserRole.Admin}
                                render={({ field: { onChange, value } }) => (
                                    <FormControl margin="normal" fullWidth>
                                        <InputLabel id="role-select-label">Rol</InputLabel>
                                        <Select
                                            labelId="role-select-label"
                                            label="Rol"
                                            value={value}
                                            onChange={(event, child) => {
                                                onChange(event, child);

                                                if (event.target.value === UserRole.Admin) {
                                                    setValue("parentId", selectableUsers[0].id);
                                                } else {
                                                    setValue("parentId", selectableUsers[1].id);
                                                }
                                            }}
                                        >
                                            <MenuItem value={UserRole.Admin}>{getRoleName(UserRole.Admin)}</MenuItem>
                                            {selectableUsers.length > 1 &&
                                                <MenuItem value={UserRole.User}>{getRoleName(UserRole.User)}</MenuItem>
                                            }
                                        </Select>
                                    </FormControl>
                                )}
                            />
                            <Controller
                                name="parentId"
                                control={control}
                                defaultValue={selectableUsers[0].id}
                                render={({ field: { onChange, value } }) => (
                                    <FormControl margin="normal" fullWidth>
                                        <InputLabel id="parent-id-select-label">Propietario</InputLabel>
                                        <Select
                                            labelId="parent-id-select-label"
                                            label="Propietario"
                                            value={value}
                                            onChange={onChange}
                                        >
                                            {selectableUsers.filter(x => x.role === (watchRole === UserRole.Admin ? UserRole.SuperAdmin : UserRole.Admin)).map(user =>
                                                <MenuItem key={user.id} value={user.id}>{user.firstName} {user.lastName}</MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleAddDialogClose(null, null)} variant="outlined">Cancelar</Button>
                    <Button type="submit" variant="outlined">Añadir</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
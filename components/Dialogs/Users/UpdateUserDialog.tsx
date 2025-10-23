import { VisibilityOff, Visibility } from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, IconButton, InputAdornment } from "@mui/material";
import { MouseEventHandler, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { IUser } from "../../../models/IUser";

export type IUpdateUserDialogProps = {
    openDialog: boolean;
    handleClose: () => void;
    user: IUser;
    handleUpdateUser: (userId: string, firstName: string, lastName: string, email: string, password: string | null) => void;
};

export default function UpdateUserDialog({ openDialog, handleClose, user, handleUpdateUser }: IUpdateUserDialogProps) {
    const { handleSubmit, control } = useForm();

    function onSubmit(data: FieldValues) {
        handleUpdateUser(user.id, data.firstName, data.lastName, data.email, data.password);
        handleClose();
    }

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleClickShowPassword: MouseEventHandler = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword: MouseEventHandler = (event) => {
        event.preventDefault();
    };

    const handleUpdateDialogClose: (event: object | null, reason: "backdropClick" | "escapeKeyDown" | null) => void = (_event, reason) => {
        if (reason && reason === "backdropClick") {
            return;
        }

        handleClose();
    };

    return (
        <Dialog
            open={openDialog}
            onClose={handleUpdateDialogClose}
        >
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>Editar Usuario</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Cambia los siguientes campos para actualizar el usuario
                    </DialogContentText>

                    <Controller
                        name="firstName"
                        control={control}
                        defaultValue={user.firstName}
                        rules={{
                            required: "Campo requerido"
                        }}
                        render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                            <TextField
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
                        defaultValue={user.lastName}
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
                        defaultValue={user.email}
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
                        render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                            <TextField
                                margin="normal"
                                label="Contraseña"
                                type={showPassword ? "text" : "password"}
                                fullWidth
                                variant="outlined"
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleUpdateDialogClose(null, null)} variant="outlined">Cancelar</Button>
                    <Button type="submit" variant="outlined">Actualizar</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
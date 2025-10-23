import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, FormControl, InputLabel, Select, MenuItem, DialogActions, Button } from "@mui/material";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { UserRole } from "../../../models/IUser";
import { useGetAllUsersByRoleQuery } from "../../../features/api/apiSlice";

export type IAddBuildingDialogProps = {
    openDialog: boolean;
    handleClose: () => void;
    handleAddBuilding: (buildingName: string, buildingDescription: string | null, ownerId: string, latitude: number, longitude: number) => void;
};

export default function AddBuildingDialog({ openDialog, handleClose, handleAddBuilding }: IAddBuildingDialogProps) {
    const { data: adminUsers } = useGetAllUsersByRoleQuery({ role: UserRole.Admin });

    const { handleSubmit, control } = useForm();

    function onSubmit(data: FieldValues) {
        handleAddBuilding(data.name, data.description, data.ownerId, data.latitude, data.longitude);
        handleClose();
    }

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
                <DialogTitle>Añadir Edificio</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Rellena los siguientes campos para añadir una nuevo edificio
                    </DialogContentText>

                    <Controller
                        name="name"
                        control={control}
                        defaultValue=""
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
                        name="description"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                            <TextField
                                margin="normal"
                                label="Descripción (Opcional)"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={value}
                                onChange={onChange}
                                error={invalid}
                                helperText={error ? error.message : ""}
                            />
                        )}
                    />

                    <Controller
                        name="latitude"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: "Campo requerido",
                            min: {
                                value: -180,
                                message: "Por favor introduce una longitud válida [-90, 90]"
                            },
                            max: {
                                value: 180,
                                message: "Por favor introduce una longitud válida [-90, 90]"
                            },
                            pattern: {
                                value: /^(0|[1-9]\d*)(\.\d+)?$/,
                                message: "Por favor introduce una latitud válida [-90, 90]"
                            }
                        }}
                        render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                            <TextField
                                margin="normal"
                                label="Latitud"
                                type="number"
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
                        name="longitude"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: "Campo requerido",
                            min: {
                                value: -180,
                                message: "Por favor introduce una longitud válida [-180, 180]"
                            },
                            max: {
                                value: 180,
                                message: "Por favor introduce una longitud válida [-180, 180]"
                            },
                            pattern: {
                                value: /^(0|[1-9]\d*)(\.\d+)?$/,
                                message: "Por favor introduce una longitud válida [-180, 180]"
                            }
                        }}
                        render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                            <TextField
                                margin="normal"
                                label="Longitud"
                                type="number"
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

                    {adminUsers && adminUsers.length > 0 &&
                        <Controller
                            name="ownerId"
                            control={control}
                            defaultValue={adminUsers[0].id}
                            render={({ field: { onChange, value } }) => (
                                <FormControl margin="normal">
                                    <InputLabel id="owner-id-select-label">Propietario</InputLabel>
                                    <Select
                                        labelId="owner-id-select-label"
                                        label="Propietario"
                                        value={value}
                                        onChange={onChange}
                                    >
                                        {adminUsers.map(user =>
                                            <MenuItem key={user.id} value={user.id}>{user.firstName} {user.lastName}</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            )}
                        />
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
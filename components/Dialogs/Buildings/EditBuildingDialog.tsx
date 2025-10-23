import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@mui/material";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { IBuilding } from "../../../models/IBuilding";

export type IEditBuildingDialogProps = {
    openDialog: boolean;
    building: IBuilding;
    handleClose: () => void;
    handleUpdateBuilding: (buildingId: string, buildingName: string, buildingDescription: string | null, latitude: number, longitude: number) => void;
};

export default function EditBuildingDialog({ openDialog, building, handleClose, handleUpdateBuilding }: IEditBuildingDialogProps) {
    const { handleSubmit, control } = useForm();

    function onSubmit(data: FieldValues) {
        handleUpdateBuilding(building.id, data.name, data.description, data.latitude, data.longitude);
        handleClose();
    }

    const handleEditDialogClose: (event: object | null, reason: "backdropClick" | "escapeKeyDown" | null) => void = (_event, reason) => {
        if (reason && reason === "backdropClick") {
            return;
        }

        handleClose();
    };

    return (
        <Dialog
            open={openDialog}
            onClose={handleEditDialogClose}
        >
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>Editar Edificio</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Modifica los siguientes campos para edital el edificio
                    </DialogContentText>

                    <Controller
                        name="name"
                        control={control}
                        defaultValue={building.name}
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
                        defaultValue={building.description}
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
                        defaultValue={building.latitude}
                        rules={{
                            required: "Campo requerido",
                            min: {
                                value: -90,
                                message: "Por favor introduce una longitud válida [-90, 90]"
                            },
                            max: {
                                value: 90,
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
                        defaultValue={building.longitude}
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleEditDialogClose(null, null)} variant="outlined">Cancelar</Button>
                    <Button type="submit" variant="outlined">Actualizar</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
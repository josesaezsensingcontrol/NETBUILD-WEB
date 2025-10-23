import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@mui/material";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { INeighborhood } from "../../../models/INeighborhood";

export type IEditNeighborhoodDialogProps = {
    openDialog: boolean;
    handleClose: () => void;
    neighborhood: INeighborhood;
    handleUpdateNeighborhood: (id: string, name: string, description: string | null) => void;
};

export default function EditNeighborhoodDialog({ openDialog, handleClose, neighborhood, handleUpdateNeighborhood }: IEditNeighborhoodDialogProps) {
    const { handleSubmit, control } = useForm();

    function onSubmit(data: FieldValues) {
        handleUpdateNeighborhood(neighborhood.id, data.name, data.description);
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
                <DialogTitle>Editar Vecindario</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Modifica los siguientes campos para actualizar el vecindario
                    </DialogContentText>

                    <Controller
                        name="name"
                        control={control}
                        defaultValue={neighborhood.name}
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
                        defaultValue={neighborhood.description}
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleEditDialogClose(null, null)} variant="outlined">Cancelar</Button>
                    <Button type="submit" variant="outlined">Actualizar</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
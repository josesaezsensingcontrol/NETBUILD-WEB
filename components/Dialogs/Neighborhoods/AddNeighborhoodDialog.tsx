import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@mui/material";
import { Controller, FieldValues, useForm } from "react-hook-form";

export type IAddNeighborhoodDialogProps = {
    openDialog: boolean;
    handleClose: () => void;
    handleAddNeighborhood: (name: string, description: string | null) => void;
};

export default function IAddNeighborhoodDialog({ openDialog, handleClose, handleAddNeighborhood }: IAddNeighborhoodDialogProps) {
    const { handleSubmit, control } = useForm();

    function onSubmit(data: FieldValues) {
        handleAddNeighborhood(data.name, data.description);
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
                <DialogTitle>Añadir Vecindario</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Rellena los siguientes campos para añadir una nuevo vecindario
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleAddDialogClose(null, null)} variant="outlined">Cancelar</Button>
                    <Button type="submit" variant="outlined">Añadir</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
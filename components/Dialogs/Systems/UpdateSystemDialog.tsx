import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@mui/material";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { ISystem } from "../../../models/ISystem";

export type IUpdateSystemDialogProps = {
    openDialog: boolean;
    handleClose: () => void;
    system: ISystem;
    handleUpdateSystem: (systemId: string, name: string) => void;
};

export default function UpdateSystemDialog({ openDialog, handleClose, system, handleUpdateSystem }: IUpdateSystemDialogProps) {
    const { handleSubmit, control } = useForm();

    function onSubmit(data: FieldValues) {
        handleUpdateSystem(system.id, data.name);
        handleClose();
    }

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
                <DialogTitle>Edit Device</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Change the following fields to update the device
                    </DialogContentText>

                    <Controller
                        name="name"
                        control={control}
                        defaultValue={system.name}
                        rules={{
                            required: "Campo Requerido"
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleUpdateDialogClose(null, null)} variant="outlined">Cancelar</Button>
                    <Button type="submit" variant="outlined">Actualizar</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
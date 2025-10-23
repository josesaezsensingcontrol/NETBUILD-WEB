import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Paper, Typography, Box, IconButton } from "@mui/material";
import { Stack } from "@mui/system";
import { Controller, FieldValues, useFieldArray, useForm } from "react-hook-form";
import { IDataInput } from "../../../models/IDataInput";
import { AddCircle as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

export type IAddSystemDialogProps = {
    openDialog: boolean;
    handleClose: () => void;
    handleAddSystem: (systemName: string, dataInputs: IDataInput[], metadata: { [key: string]: string }, systemId?: string | null) => void;
};

export default function AddSystemDialog({ openDialog, handleClose, handleAddSystem }: IAddSystemDialogProps) {
    const { handleSubmit, control } = useForm({
        defaultValues: {
            systemId: "",
            name: "",
            dataInputs: [{ id: "", name: "", units: "" }],
            metadata: [] as { key: string, value: string }[]
        }
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "dataInputs",
    });

    const { fields: metadataFields, append: appendMetadata, remove: removeMetadata } = useFieldArray({
        control,
        name: "metadata"
    });

    function onSubmit(data: FieldValues) {
        const metadata: { [key: string]: string } = {};
        (data.metadata as [{ key: "", value: "" }]).forEach(meta =>
            metadata[meta.key] = meta.value
        )

        handleAddSystem(data.name, data.dataInputs as IDataInput[], metadata, data.systemId);
        handleClose();
    }

    const handleAddDialogClose: (event: object | null, reason: "backdropClick" | "escapeKeyDown" | null) => void = (_event, reason) => {
        if (reason && reason === "backdropClick") {
            return;
        }

        handleClose();
    };

    const handleRemove: (index: number) => void = (index) => {
        if ((fields.length - 1) === 0) {
            append({ id: "", name: "", units: "" });
        }

        remove(index);
    }

    const handleRemoveMetadata: (index: number) => void = (index) => {
        removeMetadata(index);
    }

    return (
        <Dialog
            open={openDialog}
            onClose={handleAddDialogClose}
        >
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>Añadir Sistema</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Rellena los siguientes campos para añadir un nuevo sistema
                    </DialogContentText>

                    <Controller
                        name="systemId"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                            <TextField
                                margin="normal"
                                label="Identificador (Opcional)"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={value}
                                onChange={onChange}
                                error={invalid}
                                helperText={error ? error.message : "Si no lo indicas el sistema asignará uno automáticamente"}
                            />
                        )}
                    />

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

                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                        <Typography variant="h6">Datos</Typography>
                        <IconButton onClick={() => append({ id: "", name: "", units: "" })}>
                            <AddIcon />
                        </IconButton>
                    </Stack>
                    {fields.map((item, index) => (
                        <Paper key={item.id} elevation={8} sx={{ my: 2 }} square>
                            <Box component="div" width="100%">
                                <Stack direction="row" sx={{ mx: 1 }} alignItems="center" justifyContent="center">
                                    <IconButton onClick={() => handleRemove(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                    <Controller
                                        name={`dataInputs.${index}.id`}
                                        control={control}
                                        rules={{
                                            required: "Campo requerido"
                                        }}
                                        render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                                            <TextField
                                                margin="normal"
                                                size="small"
                                                label="Id"
                                                type="text"
                                                variant="outlined"
                                                value={value}
                                                onChange={onChange}
                                                error={invalid}
                                                required
                                                helperText={error ? error.message : ""}
                                                sx={{ mx: 1, marginBottom: "16px" }}
                                            />
                                        )}
                                    />

                                    <Controller
                                        name={`dataInputs.${index}.name`}
                                        control={control}
                                        rules={{
                                            required: "Campo requerido"
                                        }}
                                        render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                                            <TextField
                                                margin="normal"
                                                size="small"
                                                label="Name"
                                                type="text"
                                                variant="outlined"
                                                value={value}
                                                onChange={onChange}
                                                error={invalid}
                                                required
                                                helperText={error ? error.message : ""}
                                                sx={{ mx: 1, marginBottom: "16px" }}
                                            />
                                        )}
                                    />

                                    <Controller
                                        name={`dataInputs.${index}.units`}
                                        control={control}
                                        render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                                            <TextField
                                                margin="normal"
                                                size="small"
                                                label="Units"
                                                type="text"
                                                variant="outlined"
                                                value={value}
                                                onChange={onChange}
                                                error={invalid}
                                                helperText={error ? error.message : ""}
                                                sx={{ mx: 1, marginBottom: "16px" }}
                                            />
                                        )}
                                    />
                                </Stack>
                            </Box>
                        </Paper>
                    ))}
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                        <Typography variant="h6">Metadatos</Typography>
                        <IconButton onClick={() => appendMetadata({ key: "", value: "" })}>
                            <AddIcon />
                        </IconButton>
                    </Stack>
                    {metadataFields.map((item, index) => (
                        <Paper key={item.id} elevation={8} sx={{ my: 2 }} square>
                            <Box component="div" width="100%">
                                <Stack direction="row" sx={{ mx: 1 }} alignItems="center" justifyContent="center">
                                    <IconButton onClick={() => handleRemoveMetadata(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                    <Controller
                                        name={`metadata.${index}.key`}
                                        control={control}
                                        rules={{
                                            required: "Campo requerido"
                                        }}
                                        render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                                            <TextField
                                                margin="normal"
                                                size="small"
                                                label="Id"
                                                type="text"
                                                variant="outlined"
                                                value={value}
                                                onChange={onChange}
                                                error={invalid}
                                                required
                                                helperText={error ? error.message : ""}
                                                sx={{ mx: 1, marginBottom: "16px" }}
                                            />
                                        )}
                                    />

                                    <Controller
                                        name={`metadata.${index}.value`}
                                        control={control}
                                        rules={{
                                            required: "Campo requerido"
                                        }}
                                        render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                                            <TextField
                                                margin="normal"
                                                size="small"
                                                label="Name"
                                                type="text"
                                                variant="outlined"
                                                value={value}
                                                onChange={onChange}
                                                error={invalid}
                                                required
                                                helperText={error ? error.message : ""}
                                                sx={{ mx: 1, marginBottom: "16px" }}
                                            />
                                        )}
                                    />
                                </Stack>
                            </Box>
                        </Paper>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleAddDialogClose(null, null)} variant="outlined">Cancelar</Button>
                    <Button type="submit" variant="outlined">Añadir</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
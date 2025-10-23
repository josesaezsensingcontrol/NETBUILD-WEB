import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, ListSubheader, Typography, MenuItem, FormControl, InputLabel, Select, Stack, Menu } from "@mui/material";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { IDiagramNode } from "../../../models/IDiagramNode";
import { ISystem } from "../../../models/ISystem";
import { IDataInput } from "../../../models/IDataInput";
import { KeyboardArrowDown as KeyboardArrowDownIcon } from "@mui/icons-material";
import { MouseEventHandler, ReactNode, useState } from "react";
import { isSingle, validateExpression } from "../../../helpers/ExpressionHelper";

export type IEditNodeDialogProps = {
    systems: ISystem[],
    node: IDiagramNode,
    openDialog: boolean;
    handleClose: () => void;
    handleEditNode: (node: IDiagramNode) => void;
};

export default function EditNodeDialog({ systems, node, openDialog, handleClose, handleEditNode }: IEditNodeDialogProps) {
    const { handleSubmit, watch, setValue, getValues, control } = useForm();
    const watchNodeType = watch("nodeType", isSingle(node.expression) ? "single" : "expression");

    function getUnitsForSystemInput(systemId: string, dataInputId: string): string {
        return systems
            .find(c => c.id === systemId)?.dataInputs
            .find(di => di.id === dataInputId)?.units ?? "";
    }

    function getSingleSelectItems(): ReactNode[] {
        const nodes = new Array<ReactNode>();
        systems.forEach(system => {
            nodes.push(<ListSubheader key={system.id}><Typography fontWeight="bold">{system.name}</Typography></ListSubheader>);

            system.dataInputs.forEach(dataInput => {
                nodes.push(<MenuItem key={`${system.id}:${dataInput.id}`} value={`{${system.id}:${dataInput.id}}`} disableRipple>{dataInput.name}</MenuItem>);
            });
        });

        return nodes;
    }

    function getExpressionSelectItems(onClick: (system: ISystem, dataInputId: IDataInput) => void): ReactNode[] {
        const nodes = new Array<ReactNode>();

        systems.forEach(system => {
            nodes.push(<ListSubheader key={system.id}><Typography fontWeight="bold">{system.name}</Typography></ListSubheader>);

            system.dataInputs.forEach(dataInput => {
                nodes.push(
                    <MenuItem
                        key={`${system.id}:${dataInput.id}`}
                        value={`${system.id}:${dataInput.id}`}
                        onClick={() => onClick(system, dataInput)}
                        disableRipple
                    >
                        {dataInput.name}
                    </MenuItem>
                );
            });
        });

        return nodes;
    }

    function onSubmit(data: FieldValues) {
        switch (data.nodeType) {
            case 'single':
                handleEditNode({ ...node, name: data.name, expression: data.single, units: data.units });
                break;
            case 'expression':
                handleEditNode({ ...node, name: data.name, expression: data.expression, units: data.units });
                break;
            default:
                return;
        }

        handleClose();
    }

    const handleAddDialogClose: (event: object | null, reason: "backdropClick" | "escapeKeyDown" | null) => void = (_event, reason) => {
        if (reason && reason === "backdropClick") {
            return;
        }

        handleClose();
    };

    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const open = Boolean(anchorEl);

    const handleAddSystemClose = () => {
        setAnchorEl(null);
    };

    const handleAddSystemClick: MouseEventHandler = (event) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <Dialog
            open={openDialog}
            onClose={handleClose}
        >
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>Editar Nodo</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Actualiza los siguientes campos
                    </DialogContentText>

                    <Controller
                        name="name"
                        control={control}
                        defaultValue={node.name}
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
                        name="nodeType"
                        control={control}
                        defaultValue={isSingle(node.expression) ? "single" : "expression"}
                        render={({ field: { onChange, value } }) => (
                            <FormControl fullWidth margin="normal" sx={{ minWidth: 150 }}>
                                <InputLabel id="node-type-select-label">Tipo Entrada</InputLabel>
                                <Select
                                    labelId="node-type-select-label"
                                    label="Tipo Entrada"
                                    required
                                    value={value}
                                    onChange={(event, child) => {
                                        onChange(event, child);

                                        if (getValues("nodeType") === "expression") {
                                            setValue("units", isSingle(node.expression) ? "" : node.units)
                                        } else {
                                            const selectedSingleInput = getValues("single");
                                            if (selectedSingleInput === null || selectedSingleInput === undefined || selectedSingleInput === "") {
                                                setValue("units", "");
                                            } else {
                                                setValue("units", getUnitsForSystemInput(selectedSingleInput.split(":")[0].replaceAll("{", ""), selectedSingleInput.split(":")[1].replaceAll("}", "")));
                                            }
                                        }
                                    }}
                                >
                                    <MenuItem value="single">Simple</MenuItem>
                                    <MenuItem value="expression">Expresión</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    />

                    {watchNodeType === "single" &&
                        <Controller
                            name="single"
                            control={control}
                            defaultValue={isSingle(node.expression) ? node.expression : ""}
                            render={({ field: { onChange, value } }) => (
                                <FormControl fullWidth margin="normal" sx={{ minWidth: 150 }}>
                                    <InputLabel id="data-input-select-label">Sistema</InputLabel>
                                    <Select
                                        labelId="data-input-select-label"
                                        label="Dato Entrada"
                                        required
                                        value={value}
                                        onChange={(event, child) => {
                                            onChange(event, child);
                                            const selectedSingleInput = getValues("single");
                                            setValue("units", selectedSingleInput ? getUnitsForSystemInput(selectedSingleInput.split(":")[0].replaceAll("{", ""), selectedSingleInput.split(":")[1].replaceAll("}", "")) : "");
                                        }}
                                    >
                                        {
                                            getSingleSelectItems()
                                        }
                                    </Select>
                                </FormControl>
                            )}
                        />
                    }

                    {watchNodeType === "expression" &&
                        <>
                            <FormControl fullWidth margin="normal" sx={{ minWidth: 150 }}>
                                <Stack direction="row" spacing={1} maxWidth="600px">
                                    <Button
                                        variant="contained"
                                        onClick={handleAddSystemClick}
                                        endIcon={<KeyboardArrowDownIcon />}
                                    >
                                        Sistema
                                    </Button>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                    >
                                        {getExpressionSelectItems(
                                            (system, dataInput) => {
                                                handleAddSystemClose();
                                                setValue("expression", getValues("expression") + `{${system.id}:${dataInput.id}}`);
                                            })
                                        }
                                    </Menu>
                                </Stack>
                            </FormControl>
                            <Controller
                                name="expression"
                                control={control}
                                rules={{
                                    validate: (value) => (value !== undefined && value !== null && value !== "" && validateExpression(value, systems)) || "Expresión inválida"
                                }}
                                defaultValue={node.expression}
                                render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                                    <TextField
                                        margin="normal"
                                        label="Expresión"
                                        type="text"
                                        fullWidth
                                        multiline
                                        variant="outlined"
                                        value={value}
                                        onChange={onChange}
                                        error={invalid}
                                        helperText={error ? error.message : ""}
                                    />
                                )}
                            />
                        </>
                    }

                    <Controller
                        name="units"
                        control={control}
                        defaultValue={node.units}
                        rules={{
                            required: "Campo requerido"
                        }}
                        render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                            <TextField
                                margin="normal"
                                label="Unidades"
                                type="text"
                                fullWidth
                                required
                                variant="outlined"
                                value={value}
                                onChange={onChange}
                                error={invalid}
                                helperText={error ? error.message : ""}
                                disabled={watchNodeType === "single"}
                            />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleAddDialogClose(null, null)} variant="outlined">Cancelar</Button>
                    <Button type="submit" variant="outlined">Actualizar</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
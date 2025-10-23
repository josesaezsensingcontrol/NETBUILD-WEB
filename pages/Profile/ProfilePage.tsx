import { VisibilityOff, Visibility } from "@mui/icons-material";
import { TextField, InputAdornment, IconButton, Button, Backdrop, CircularProgress, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useState, MouseEvent } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useUpdateUserMutation } from "../../features/api/apiSlice";
import { profileChanged, selectCurrentUser } from "../../features/auth/authSlice";

export default function ProfilePage() {
    const authUser = useAppSelector(selectCurrentUser);
    const dispatch = useAppDispatch();

    const { handleSubmit, control } = useForm();

    const [updateUser, updateUserResult] = useUpdateUserMutation();

    async function onSubmit(data: FieldValues) {
        try {
            if (authUser) {
                await updateUser({
                    userId: authUser.id,
                    updateUser: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        password: data.password
                    }
                }).unwrap();

                dispatch(profileChanged({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email
                }));
            }
        } catch {
            console.log("Error updating profile");
        }
    }

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleClickShowPassword: () => void = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword: (event: MouseEvent) => void = (event) => {
        event.preventDefault();
    };

    return (
        <>
            <Grid container display="flex" spacing={1} direction="row" alignItems="center" justifyContent="center" width='100%' sx={{ mt: 2 }}>
                <Grid item xs={12} sm={12} md={9} sx={{ ml: 1 }} >
                    <Typography variant="h4">
                        Perfil de Usuario
                    </Typography>
                </Grid>
                <Grid item>
                    <form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name="firstName"
                            control={control}
                            defaultValue={authUser?.firstName}
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
                            defaultValue={authUser?.lastName}
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
                            defaultValue={authUser?.email}
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

                        <Box marginTop={2} display="flex" justifyContent="end">
                            <Button type="submit" variant="outlined" sx={{ justifyContent: "end" }}>Actualizar</Button>
                        </Box>
                    </form>
                </Grid>
            </Grid>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={updateUserResult.isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}
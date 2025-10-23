import { Visibility, VisibilityOff } from "@mui/icons-material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { ChangeEvent, FormEvent, MouseEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { apiSlice, useLoginMutation } from "../../features/api/apiSlice";
import { setCredentials } from "../../features/auth/authSlice";
import { setSelectedBuildingId } from "../../features/buildings/buildingsSlice";
import Copyright from "../Copyright/Copyright";
import { setSelectedNeighborhood } from "../../features/neighborhoods/neighborhoodsSlice";

const LoginForm = () => {
    const dispatch = useAppDispatch();
    const [login] = useLoginMutation();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [isLoggingIn, setIsLogging] = useState(false);
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    const handleEmailChange: (event: ChangeEvent<HTMLInputElement>) => void = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange: (event: ChangeEvent<HTMLInputElement>) => void = (event) => {
        setPassword(event.target.value);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword: MouseEventHandler = (event) => {
        event.preventDefault();
    };

    const handleSubmit: (event: FormEvent) => void = async e => {
        e.preventDefault();
        try {
            setIsLogging(true);

            const result = await login({ email, password }).unwrap();
            if (result.isSuccess) {
                setIsLogging(false);
                setShowError(false);
                dispatch(apiSlice.util.resetApiState());
                dispatch(setCredentials(result.data));
                dispatch(setSelectedNeighborhood(null));
                dispatch(setSelectedBuildingId(null));
                navigate("/");
            }
        } catch (error) {
            setIsLogging(false);
            setError("Usuario o contraseña inválidos, inténtalo de nuevo");
            setShowError(true);
        }
    };

    return (
        <Stack
            width="100%"
            sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Box component="img" src='logo.png' maxWidth='50%' sx={{ my: 2 }} />

            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '70%' }}>
                {isLoggingIn &&
                    <LinearProgress />
                }

                {!isLoggingIn && <>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Correo Electrónico"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={handleEmailChange}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Contraseña"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={handlePasswordChange}
                        InputProps={{
                            endAdornment:
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => handleClickShowPassword()}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                        }}
                    />

                    {showError &&
                        <Alert sx={{ width: 'auto' }} severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {error}
                        </Alert>
                    }

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Acceder
                    </Button>
                </>
                }

                <Copyright />
            </Box>
        </Stack >
    )
}

export default LoginForm;
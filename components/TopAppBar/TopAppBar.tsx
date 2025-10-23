import { Box, IconButton, Menu, MenuItem, Button, Tooltip, Avatar } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../models/IUser";
import { localLogout, selectCurrentUser } from "../../features/auth/authSlice";
import { apiSlice, useLogoutMutation } from "../../features/api/apiSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const settings = ['Perfil', 'Desconectar'];

const TopAppBar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const authUser = useAppSelector(selectCurrentUser);
    const [logout] = useLogoutMutation();

    const pages = authUser?.role === UserRole.User ? ["Edificios"] : ['Edificios', 'Usuarios'];

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handlePage = (page: string) => {
        switch (page) {
            case "Edificios":
                navigate("/dashboard");
                break;

            case "Usuarios":
                navigate("/users");
                break;
        }
    };

    const handleSetting = async (setting: string) => {
        switch (setting) {
            case "Perfil":
                handleCloseUserMenu();
                navigate("/profile");
                break;
            case "Desconectar":
                try {
                    await logout().unwrap();
                    dispatch(localLogout());
                    dispatch(apiSlice.util.resetApiState());
                    navigate("/");
                } catch {
                    console.log("Error logging out");
                }

                break;
        }
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Box component="img" src='/logo-white.png' alt="LOGO_APP" sx={{ maxHeight: 50, display: { xs: 'none', md: 'flex' }, mr: 2 }} />

                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                        }}
                    >
                        {pages.map((page) => (
                            <MenuItem key={page} onClick={() => handlePage(page)}>
                                <Typography textAlign="center">{page}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>

                <Box
                    component="div"
                    sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                >
                    <Box component="img" src='/logo.png' alt="LOGO_APP" sx={{ maxHeight: 40 }} />
                </Box>

                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    {pages.map((page) => (
                        <Button
                            key={page}
                            onClick={() => handlePage(page)}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            {page}
                        </Button>
                    ))}
                </Box>

                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar>
                                {authUser?.initials}
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {settings.map((setting) => (
                            <MenuItem key={setting} onClick={() => handleSetting(setting)}>
                                <Typography textAlign="center">{setting}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopAppBar;
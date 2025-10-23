import CssBaseline from '@mui/material/CssBaseline';
import createTheme from '@mui/material/styles/createTheme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { store } from './app/store';
import PrivateRoute, { PrivateRouteProps } from './components/PrivateRoute/PrivateRoute';
import LoginPage from './pages/Login/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ProfilePage from './pages/Profile/ProfilePage';
import UsersPage from './pages/Users/UsersPage';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        scrollbarWidth: "thin",
        '&::-webkit-scrollbar': {
          width: '0.4em',
        },
        '&::-webkit-scrollbar-track': {
          background: "#f1f1f1",
        },
        '&::-webkit-scrollbar-thumb': {
          borderRadius: 6,
          backgroundColor: '#0a416e',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#0a416e'
        }
      }
    }
  }
});

const defaultProtectedRouteProps: Omit<PrivateRouteProps, 'outlet'> = {
  authenticationPath: '/login',
};

function App() {
  useEffect(() => {
    window.addEventListener('unhandledrejection', function (event) {
      event.preventDefault();
    });
  });

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer theme='colored' />
        <Router>
          <Routes>
            <Route path='dashboard' element={<PrivateRoute {...defaultProtectedRouteProps} outlet={<DashboardPage />} />} />
            <Route path='users' element={<PrivateRoute {...defaultProtectedRouteProps} outlet={<UsersPage />} />} />
            <Route path='profile' element={<PrivateRoute {...defaultProtectedRouteProps} outlet={<ProfilePage />} />} />
            <Route path='login' element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

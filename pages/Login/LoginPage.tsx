import { Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import LoginForm from '../../components/LoginForm/LoginForm';

export default function LoginPage() {
  return (
    <Grid container component="main" justifyContent="center" sx={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: '#ffffff'}}>
        <Grid item xs={12} sm={8} md={5} component={Stack}>
            <LoginForm/>
        </Grid>
    </Grid>
  );
}
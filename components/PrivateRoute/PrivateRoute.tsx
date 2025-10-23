import {
    Navigate,
} from 'react-router-dom';
import { selectCurrentUser } from '../../features/auth/authSlice';
import Layout from '../../pages/Layout/Layout';
import { useAppSelector } from '../../app/hooks';

export type PrivateRouteProps = {
    authenticationPath: string;
    outlet: JSX.Element;
};

export default function PrivateRoute({ authenticationPath, outlet }: PrivateRouteProps) {
    const authUser = useAppSelector(selectCurrentUser);

    if (authUser) {
        return (
            <Layout>
                {outlet}
            </Layout>
        )
    } else {
        return <Navigate to={{ pathname: authenticationPath }} />;
    }
}
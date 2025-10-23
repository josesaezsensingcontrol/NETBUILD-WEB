import { Box, Stack } from '@mui/material';
import { FunctionComponent, PropsWithChildren } from 'react';
import TopAppBar from '../../components/TopAppBar/TopAppBar';

const Layout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <Box
      justifyContent="center"
      sx={{ display: 'flex', width: '100%', maxHeight: '100vh', minHeight: '100vh', backgroundColor: '#ffffff' }}
    >
      <Stack width="100%">
        <TopAppBar />
        <Box component="main">{children}</Box>
      </Stack>
    </Box>
  );
};

export default Layout;

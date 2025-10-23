import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useGetOrderbookQuery } from '../../../../features/api/apiSlice';
import { useEffect } from 'react';

export default function OrderBook() {
  const { data: orderbook, refetch } = useGetOrderbookQuery();

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [refetch]);

  return (
    <Paper sx={{ padding: 2, width: '100%', height: '100%', paddingBottom: 4 }}>
      <Typography width="100%" paddingBottom={1} textAlign="center" fontWeight="bold">
        Libro de órdenes
      </Typography>
      <Stack direction="column" width="100%" height="100%" paddingBottom={1}>
        <Typography fontWeight="bold">Venta</Typography>
        <TableContainer sx={{ height: '50%' }}>
          <Table stickyHeader width="100%">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography fontWeight="bold">Origen</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Cantidad</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Precio</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderbook
                ?.filter((e) => e.type === 'Ask')
                ?.map((entry) => {
                  return (
                    <TableRow key={entry.user}>
                      <TableCell>
                        <Typography>{entry.user}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{entry.amount.toFixed(2)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{entry.price.toFixed(2)}</Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography fontWeight="bold">Compra</Typography>
        <TableContainer sx={{ height: '50%' }} title="hello">
          <Table stickyHeader width="100%">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography fontWeight="bold">Origen</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Cantidad</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Precio</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderbook
                ?.filter((e) => e.type === 'Bid')
                ?.map((entry) => {
                  return (
                    <TableRow key={entry.user}>
                      <TableCell>
                        <Typography>{entry.user}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{entry.amount.toFixed(2)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{entry.price.toFixed(2)}</Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Paper>
  );
}

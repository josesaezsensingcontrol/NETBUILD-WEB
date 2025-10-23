import { Paper, Stack, Typography } from '@mui/material';
import { useGetTransactionsQuery } from '../../../../features/api/apiSlice';
import { useEffect } from 'react';

export default function RecentTransactions() {
  const { data: transactions, refetch } = useGetTransactionsQuery();

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [refetch]);

  return (
    <Paper sx={{ padding: 2, height: '100%', width: '100%' }}>
      <Stack direction="column" height="100%" alignItems="center" justifyContent="top" spacing={2}>
        <Typography width="100%" textAlign="center" fontWeight="bold">
          Transacciones recientes
        </Typography>
        <Stack direction="column" width="100%" maxHeight="95%" spacing={2} justifyContent="top" overflow="auto">
          {transactions?.map((transaction) => {
            return (
              <Paper elevation={6} sx={{ width: '100%', padding: 2 }} key={transaction.timestamp}>
                <Typography>
                  Movimiento: {transaction.seller} =&gt; {transaction.buyer}
                </Typography>
                <Typography>Cantidad: {transaction.amount}</Typography>
                <Typography>Precio: {transaction.price} €</Typography>
                <Typography>Fecha: {new Date(transaction.timestamp).toLocaleString()}</Typography>
              </Paper>
            );
          })}
        </Stack>
      </Stack>
    </Paper>
  );
}

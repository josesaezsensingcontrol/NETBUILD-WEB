import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { usePublishAskMutation, usePublishBidMutation } from '../../../../features/api/apiSlice';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { IBuilding } from '../../../../models/IBuilding';

type OrderFormProps = {
  building: IBuilding;
};

export default function OrderForm({ building }: OrderFormProps) {
  const [buyPrice, setBuyPrice] = useState(25);
  const [buyAmount, setBuyAmount] = useState(10);
  const [sellPrice, setSellPrice] = useState(25);
  const [sellAmount, setSellAmount] = useState(10);

  const [publishAsk] = usePublishAskMutation();
  const [publishBid] = usePublishBidMutation();

  const handlePublishAsk = async () => {
    try {
      await publishAsk({ user: building.name, sellAmount: sellAmount, sellPrice: sellPrice }).unwrap();

      toast.success('Orden de venta publicada');
    } catch (e) {
      console.error(e);
      toast.error('Error al publicar orden de venta');
    }
  };

  const handlePublishBid = async () => {
    try {
      await publishBid({ user: building.name, buyAmount: buyAmount, buyPrice: buyPrice }).unwrap();

      toast.success('Orden de compra publicada');
    } catch (e) {
      console.error(e);
      toast.error('Error al publicar orden de compra');
    }
  };

  return (
    <Paper sx={{ padding: 2, height: '100%', width: '100%' }}>
      <Stack direction="column" height="100%" alignItems="center" justifyContent="space-evenly" spacing={2}>
        <Typography width="100%" textAlign="center" fontWeight="bold">
          Formulario de órdenes
        </Typography>
        <Stack
          direction="column"
          height="100%"
          width="100%"
          alignItems="center"
          justifyContent="space-evenly"
          spacing={2}
        >
          <Stack direction="column" spacing={2}>
            <FormControl>
              <InputLabel>Precio</InputLabel>
              <OutlinedInput
                type={'text'}
                value={buyPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    setBuyPrice(1);
                  } else if (/^\d+$/.test(value)) {
                    setBuyPrice(parseInt(value));
                  }
                }}
                endAdornment={<InputAdornment position="end">€</InputAdornment>}
                label="Precio"
              />
            </FormControl>
            <TextField
              label="Cantidad"
              value={buyAmount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setBuyAmount(1);
                } else if (/^\d+$/.test(value)) {
                  setBuyAmount(parseInt(value));
                }
              }}
            />
            <Button variant="contained" onClick={handlePublishBid}>
              Comprar
            </Button>
          </Stack>

          <Stack direction="column" spacing={2}>
            <FormControl>
              <InputLabel>Precio</InputLabel>
              <OutlinedInput
                type={'text'}
                value={sellPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    setSellPrice(1);
                  } else if (/^\d+$/.test(value)) {
                    setSellPrice(parseInt(value));
                  }
                }}
                endAdornment={<InputAdornment position="end">€</InputAdornment>}
                label="Precio"
              />
            </FormControl>
            <TextField
              label="Cantidad"
              value={sellAmount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setSellAmount(1);
                } else if (/^\d+$/.test(value)) {
                  setSellAmount(parseInt(value));
                }
              }}
            />
            <Button variant="contained" onClick={handlePublishAsk}>
              Vender
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}

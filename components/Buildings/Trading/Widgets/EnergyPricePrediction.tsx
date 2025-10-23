import { Paper, Stack, Typography } from '@mui/material';

export default function EnergyPricePrediction() {
  return (
    <Paper sx={{ padding: 2, height: '100%', width: '100%' }}>
      <Stack direction="column" height="100%" spacing={2}>
        <Typography width="100%" textAlign="center" fontWeight="bold">
          Predicción Precio Energía
        </Typography>
        <Typography width="100%" height="100%" variant="h2" textAlign="center" alignContent="center">
          25 €
        </Typography>
      </Stack>
    </Paper>
  );
}

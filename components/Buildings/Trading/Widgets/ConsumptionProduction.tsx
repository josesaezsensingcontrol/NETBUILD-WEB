import { Paper, Stack, Typography } from '@mui/material';
import { IBuilding } from '../../../../models/IBuilding';
import { EnergySavingsLeaf as ProductionIcon, ElectricMeter as ConsumptionIcon } from '@mui/icons-material';

type ConsumptionProductionProps = {
  building: IBuilding;
};

export default function ConsumptionProduction({ building }: ConsumptionProductionProps) {
  return (
    <Paper sx={{ padding: 2, height: '100%', width: '100%' }}>
      <Typography width="100%" textAlign="center" fontWeight="bold">
        Consumo & Producción {building.name}
      </Typography>

      <Stack direction="row" height="100%" alignItems="center" justifyContent="space-evenly">
        <Stack direction="column" alignItems="center" spacing={3}>
          <ProductionIcon fontSize="large" sx={{ color: '#90EE90', transform: 'scale(2)' }} />
          <Typography variant="h5" color="white" sx={{ backgroundColor: '#90EE90', padding: 1 }}>
            22 kWh
          </Typography>
        </Stack>

        <Stack direction="column" alignItems="center" spacing={3}>
          <ConsumptionIcon fontSize="large" sx={{ color: '#F88379', transform: 'scale(2)' }} />
          <Typography variant="h5" color="white" sx={{ backgroundColor: '#F88379', padding: 1 }}>
            10 kWh
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

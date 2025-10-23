import { Paper, Stack, Typography } from '@mui/material';
import { IBuilding } from '../../../../models/IBuilding';
import { set } from 'date-fns';

type WeatherForecastProps = {
  building: IBuilding;
};

export default function WeatherForecast({ building }: WeatherForecastProps) {
  const currentDate = set(new Date(), { minutes: 0, seconds: 0, milliseconds: 0 }).getTime() / 1000;
  return (
    <Paper sx={{ padding: 2, height: '100%', width: '100%' }}>
      <Typography width="100%" textAlign="center" fontWeight="bold">
        Previsión Meteorológica
      </Typography>
      <Stack direction="column" width="100%" height="90%" justifyContent="space-evenly">
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography>Temperatura</Typography>
          <Typography>
            {building.weatherForecast?.temperature.find((t) => t.timestamp === currentDate)?.value?.toFixed(2)} ºC
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography>Humedad</Typography>
          <Typography>
            {building.weatherForecast?.humidity.find((h) => h.timestamp === currentDate)?.value} %
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography>Radiación solar</Typography>
          <Typography>
            {building.weatherForecast?.directSolarRadiation.find((s) => s.timestamp === currentDate)?.value?.toFixed(2)}{' '}
            W/m²
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

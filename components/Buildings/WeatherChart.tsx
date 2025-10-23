import { Box, Stack, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { ChartOptions, Color, Point } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useRef } from 'react';
import { IDataPoint } from '../../models/IDataPoint';

ChartJS.register(LinearScale, PointElement, LineElement, TimeScale, TimeSeriesScale, Tooltip, Legend);

export type WeatherChartProps = {
  data?: IDataPoint[];
  name: string;
  units: string;
  color: Color;
  min?: number;
};

export default function WeatherChart({ data, name, units, color, min }: WeatherChartProps) {
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'timeseries',
        time: {
          unit: 'day',
        },
      },
      data: {
        type: 'linear',
        position: 'left',
        min: min,
        ticks: {
          callback: (value) => {
            return `${value} ${units}`;
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const chartRef = useRef<ChartJS<'line', Point[], string>>(null);

  return data ? (
    <Box minHeight={250} maxHeight={250} width="100%">
      <Line
        ref={chartRef}
        options={options}
        data={{
          datasets: [
            {
              borderColor: color,
              backgroundColor: color,
              pointBorderColor: color,
              pointBackgroundColor: color,
              yAxisID: 'data',
              label: `${name} [${units}]`,
              data: data.map((t) => ({ x: t.timestamp * 1000, y: t.value } as Point)),
            },
          ],
        }}
      />
    </Box>
  ) : (
    <Stack width="100%" height="30vh" alignItems="center" justifyContent="center">
      <Typography>No hay datos meteorológicos</Typography>
    </Stack>
  );
}

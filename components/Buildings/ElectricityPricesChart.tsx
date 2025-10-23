import { Stack, Typography } from '@mui/material';
import { ChartOptions, Point } from 'chart.js';
import { useRef } from 'react';
import { Line } from 'react-chartjs-2';
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
import 'chartjs-adapter-date-fns';
import { useGetElectricityPricesQuery } from '../../features/api/apiSlice';

ChartJS.register(LinearScale, PointElement, LineElement, TimeScale, TimeSeriesScale, Tooltip, Legend);

const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      type: 'timeseries',
      time: {
        unit: 'hour',
      },
    },
    data: {
      type: 'linear',
      position: 'left',
      ticks: {
        callback: (value) => {
          return `${value} €/kWh`;
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

export type ElectricityPricesChartProps = {
  fromDate?: string;
  toDate?: string;
};

export default function ElectricityPricesChart({ fromDate, toDate }: ElectricityPricesChartProps) {
  const chartRef = useRef<ChartJS<'line', Point[], string>>(null);

  const { data } = useGetElectricityPricesQuery({ fromDate, toDate });

  return data ? (
    <Line
      ref={chartRef}
      options={options}
      data={{
        datasets: [
          {
            borderColor: '#002eff',
            backgroundColor: '#002eff',
            pointBorderColor: '#002eff',
            pointBackgroundColor: '#002eff',
            yAxisID: 'data',
            label: 'Energy Price [€ / kWh]',
            data: data ? data.map((d) => ({ x: d.date, y: d.value } as Point)) : [],
          },
        ],
      }}
    />
  ) : (
    <Stack width="100%" height="100%" alignItems="center" justifyContent="center">
      <Typography>No hay datos</Typography>
    </Stack>
  );
}

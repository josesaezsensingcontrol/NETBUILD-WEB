import { IBuilding } from '../../../models/IBuilding';
import RecentTransactions from './Widgets/RecentTransactions';
import OrderBook from './Widgets/OrderBook';
import EnergyPricePrediction from './Widgets/EnergyPricePrediction';
import WeatherForecast from './Widgets/WeatherForecast';
import ConsumptionProduction from './Widgets/ConsumptionProduction';
import { Stack } from '@mui/material';
import OrderForm from './Widgets/OrderForm';

type TradingTabProps = {
  building: IBuilding;
};

export default function TradingTab({ building }: TradingTabProps) {
  return (
    <Stack direction="column" width="100%" height="calc(100% - 48px)" spacing={1} padding={1}>
      <Stack direction="row" width="100%" height="30%" spacing={1}>
        <WeatherForecast building={building} />
        <EnergyPricePrediction />
        <ConsumptionProduction building={building} />
      </Stack>

      <Stack direction="row" width="100%" height="70%" spacing={1}>
        <OrderBook />
        <RecentTransactions />
        <OrderForm building={building} />
      </Stack>
    </Stack>
  );
}

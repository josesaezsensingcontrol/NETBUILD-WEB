import { ITimestampedValue } from '../../signalr/INewDataMessage';
import { IResponse } from '../IResponse';

export type IGetElectricityPricesResponse = IResponse<ITimestampedValue[]>;

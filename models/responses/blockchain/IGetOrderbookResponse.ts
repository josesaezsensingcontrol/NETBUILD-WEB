import { IOrderbookEntry } from '../../IOrderbookEntry';
import { IResponse } from '../IResponse';

export type IGetOrderbookResponse = IResponse<IOrderbookEntry[]>;

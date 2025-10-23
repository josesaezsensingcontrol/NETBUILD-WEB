import { IBlockchainTransaction } from '../../IBlockchainTransaction';
import { IResponse } from '../IResponse';

export type IGetTransactionsResponse = IResponse<IBlockchainTransaction[]>;

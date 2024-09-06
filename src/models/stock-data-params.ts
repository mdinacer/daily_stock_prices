import { z } from 'zod';
import { StockData } from './stock-data';

export const StockDataParamsSchema = z.object({
  ticker: z.string().min(1, { message: 'Ticker is required' }),
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

export type StockDataParams = z.infer<typeof StockDataParamsSchema>;


export interface QueryReturnValues{
  status: string,
  message: string,
  errors?:Array<{path:string, message:string}>
  data: Array<StockData>;
}

export interface StockMetadata {
  tickers: string[];
  columns: string[];
  minDate: Date | undefined;
  maxDate: Date | undefined;
}
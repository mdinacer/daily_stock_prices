// /src/app/actions/calculateReturns.ts

'use server';

import {
  StockDailyReturn,
  StockDailyReturnSchema
} from '@/models/stock-daily-returns';
import { StockDataParams } from '@/models/stock-data-params';
import { getStockData } from '@/actions/getStockData'; // Adjust the import path as needed

export async function calculateReturns({
  ticker,
  startDate,
  endDate
}: StockDataParams): Promise<Array<StockDailyReturn>> {
  try {
    const stockData = await getStockData({ ticker, startDate, endDate });

    stockData.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const returns: Array<StockDailyReturn> = [];

    for (let i = 1; i < stockData.length; i++) {
      const previousDay = stockData[i - 1];
      const currentDay = stockData[i];

      if (previousDay.close !== 0) {
        const dailyReturn =
          (currentDay.close - previousDay.close) / previousDay.close;
        returns.push(
          StockDailyReturnSchema.parse({ date: currentDay.date, dailyReturn })
        );
      }
    }

    return returns;
  } catch (error: any) {
    throw new Error(`Failed to calculate returns. Error: ${error.message}`);
  }
}

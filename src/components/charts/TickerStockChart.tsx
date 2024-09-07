'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { StockDailyReturn } from '@/models/stock-daily-returns';
import { StockData } from '@/models/stock-data';
import { useMemo } from 'react';
import TickerGeneralDataChart from './TickerGeneralDataChart';
import TickerDailyReturnChart from './TickerDailyReturnChart';

interface Props {
  data: Array<StockData>;
  dailyReturns: Array<StockDailyReturn>;
}

export function TickerStockChart({ data, dailyReturns }: Props) {
  const chartData = useMemo(
    () =>
      data.map((stock) => {
        return {
          date: stock.date,
          open: stock.open,
          high: stock.high,
          low: stock.low,
          close: stock.close
        };
      }),
    [data]
  );

  const ticker = useMemo(
    () => (data.length > 0 ? data[0].ticker : 'Unknown'),
    [data]
  );

  const { startDate, endDate } = useMemo(() => {
    const startDate =
      data.length > 0 ? new Date(data[data.length - 1].date) : new Date();
    const endDate = data.length > 0 ? new Date(data[0].date) : new Date();

    return { startDate, endDate };
  }, [data]);

  return (
    <Tabs defaultValue="data" className="h-auto w-full">
      <TabsList>
        <TabsTrigger value="data">General Data</TabsTrigger>
        <TabsTrigger value="daily">Daily Returns</TabsTrigger>
      </TabsList>
      <TabsContent value="data">
        <TickerGeneralDataChart
          ticker={ticker}
          chartData={chartData}
          startDate={startDate}
          endDate={endDate}
        />
      </TabsContent>
      <TabsContent value="daily">
        <TickerDailyReturnChart
          ticker={ticker}
          chartData={dailyReturns}
          startDate={startDate}
          endDate={endDate}
        />
      </TabsContent>
    </Tabs>
  );
}

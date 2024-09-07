'use client';
import StockComparisonChart from '@/components/charts/StockComparisonChart';
import { TickerStockChart } from '@/components/charts/TickerStockChart';
import TickerStockChartAnalysis from '@/components/charts/TickerStockChartAnalysis';
import StockForm from '@/components/forms/StockForm';
import { StockDailyReturn } from '@/models/stock-daily-returns';
import { StockData } from '@/models/stock-data';
import { getData } from '@/services/csv_to_stock_data';
import { useCallback, useEffect, useState } from 'react';

export default function Home() {
  const [stockData, setStockData] = useState<Array<StockData>>([]);
  const [tickerData, setTickerData] = useState<Array<StockData>>([]);
  const [tickerDailyReturn, setTickerDailyReturn] = useState<
    Array<StockDailyReturn>
  >([]);

  const handleLoadStockData = useCallback(async () => {
    try {
      const data = await getData();
      setStockData(data);
    } catch (error: any) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    handleLoadStockData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="grid max-h-screen gap-4 p-4 sm:px-6 sm:py-16 md:gap-8">
      <StockComparisonChart data={stockData} />
      <div>
        <StockForm
          onSubmit={(data, returns) => {
            setTickerData(data);
            setTickerDailyReturn(returns);
          }}
        />
      </div>
      <div className="grid max-h-screen flex-1 items-start gap-4 p-4 sm:px-6 sm:py-16 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          {tickerData.length > 0 && (
            <TickerStockChart
              data={tickerData}
              dailyReturns={tickerDailyReturn}
            />
          )}
        </div>
        {tickerData.length > 0 && (
          <TickerStockChartAnalysis
            dailyReturns={tickerDailyReturn}
            data={tickerData}
          />
        )}
      </div>
    </main>
  );
}

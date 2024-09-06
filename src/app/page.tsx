'use client';
import { TickerStockChart } from '@/components/charts/TickerStockChart';
import TickerStockChartAnalysis from '@/components/charts/TickerStockChartAnalysis';
import StockForm from '@/components/forms/StockForm';
import { StockData } from '@/models/stock-data';
import { useState } from 'react';

export default function Home() {
  const [tickerData, setTickerData] = useState<Array<StockData>>([]);
  // const data: Array<StockData> = await getPrices();

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="mx-auto grid h-full w-full max-w-6xl gap-4 py-14">
        {/* <p className="whitespace-pre">{JSON.stringify(data, null, 2)}</p> */}
        <StockForm onSubmit={setTickerData} />

        <div className="grid grid-cols-2 gap-4">
          {tickerData.length > 0 && <TickerStockChart data={tickerData} />}
          {tickerData.length > 0 && (
            <TickerStockChartAnalysis data={tickerData} />
          )}
        </div>
      </div>
    </main>
  );
}

import { StockData } from "@/models/stock-data";

type ChartData = {
  date: string;
  [key: string]: number | string; // Allow string for date and number for values
};
  
export function transformToChartData(
  stockData: StockData[],
  property: 'open' | 'high' | 'low' | 'close'
): ChartData[] {
  const groupedData: { [date: string]: { [ticker: string]: number } } = {};

  stockData.forEach((data) => {
    if (!groupedData[data.date]) {
      groupedData[data.date] = {};
    }
    groupedData[data.date][data.ticker] = data[property];
  });

  return Object.keys(groupedData).map((date) => ({
    date,
    ...groupedData[date],
  }));
}
  
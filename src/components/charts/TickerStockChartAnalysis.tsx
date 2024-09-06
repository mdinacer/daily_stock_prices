import { StockData } from '@/models/stock-data';
import { format } from 'date-fns';
import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../ui/card';

interface Props {
  data: Array<StockData>;
}

const TickerStockChartAnalysis: React.FC<Props> = ({ data }) => {
  const feedback = useMemo(() => analyzeStockData(data), [data]);

  if (!feedback) return null;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>
          Analysis of stock data from <span>{feedback.startDate}</span> to{' '}
          <span>{feedback.endDate}</span>
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="grid flex-1 gap-y-2">
        <p>
          <span className="font-semibold">Trend:</span> The stock price shows a{' '}
          <span className="font-bold">{feedback.trend}</span> trend over this
          period.
        </p>
        <p>Average Prices</p>
        <div className="grid w-full grid-cols-4 gap-4">
          <InfoBox title="open" value={feedback.avgOpen.toFixed(2)} />
          <InfoBox title="hight" value={feedback.avgHigh.toFixed(2)} />
          <InfoBox title="low" value={feedback.avgLow.toFixed(2)} />
          <InfoBox title="close" value={feedback.avgClose.toFixed(2)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-center space-x-3 rounded-lg border px-4 py-2">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Highest Price
            </p>
            <p className="text-lg font-medium">
              ${feedback.highestPrice.toFixed(2)}
            </p>
          </div>
          <div className="flex items-center justify-center space-x-3 rounded-lg border px-4 py-2">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Lowest Price
            </p>
            <p className="text-lg font-medium">
              ${feedback.volatility.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-y-1.5 whitespace-pre bg-muted pt-4 text-sm">
        <p>{`**Volatility**: The price fluctuated by $${feedback.volatility.toFixed(2)} during this period.`}</p>
      </CardFooter>
    </Card>
  );
};

export default TickerStockChartAnalysis;

const InfoBox = ({
  title,
  value
}: {
  title: string;
  value: number | string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border px-4 py-2">
      <p className="text-xs font-semibold uppercase text-muted-foreground">
        {title}
      </p>
      <p className="text-lg font-medium">${value}</p>
    </div>
  );
};

function analyzeStockData(data: Array<StockData>) {
  if (data.length === 0) {
    return undefined;
  }

  // Extract dates and prices
  const dates = data.map((stock) => new Date(stock.date));
  const opens = data.map((stock) => stock.open);
  const highs = data.map((stock) => stock.high);
  const lows = data.map((stock) => stock.low);
  const closes = data.map((stock) => stock.close);

  // Calculate average, min, and max prices
  const average = (arr: number[]) =>
    arr.reduce((sum, value) => sum + value, 0) / arr.length;
  const highest = (arr: number[]) => Math.max(...arr);
  const lowest = (arr: number[]) => Math.min(...arr);

  const avgOpen = average(opens);
  const avgHigh = average(highs);
  const avgLow = average(lows);
  const avgClose = average(closes);

  const highestPrice = highest(highs);
  const lowestPrice = lowest(lows);

  const startDate = format(dates[dates.length - 1], 'MMM dd, yyyy');
  const endDate = format(dates[0], 'MMM dd, yyyy');

  // Determine trend
  const trend = closes[0] > closes[closes.length - 1] ? 'downward' : 'upward';

  // Calculate volatility
  const volatility = highestPrice - lowestPrice;

  return {
    startDate,
    endDate,
    trend,
    avgOpen,
    avgHigh,
    avgLow,
    avgClose,
    highestPrice,
    lowestPrice,
    volatility
  };

  //   return `
  //       Analysis of stock data from ${startDate} to ${endDate}:

  //       - **Trend**: The stock price shows a ${trend} trend over this period.
  //       - **Average Prices**:
  //         - Open: $${avgOpen.toFixed(2)}
  //         - High: $${avgHigh.toFixed(2)}
  //         - Low: $${avgLow.toFixed(2)}
  //         - Close: $${avgClose.toFixed(2)}
  //       - **Highest Price**: $${highestPrice.toFixed(2)}
  //       - **Lowest Price**: $${lowestPrice.toFixed(2)}
  //       - **Volatility**: The price fluctuated by $${volatility.toFixed(2)} during this period.
  //     `;
}

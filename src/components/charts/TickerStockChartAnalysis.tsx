import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { StockDailyReturn } from '@/models/stock-daily-returns';
import { StockData } from '@/models/stock-data';
import {
  analyzeDailyReturns,
  analyzeStockDataForTicker
} from '@/services/data-analysis';
import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card';

interface Props {
  data: Array<StockData>;
  dailyReturns: Array<StockDailyReturn>;
}

const TickerStockChartAnalysis: React.FC<Props> = ({ data, dailyReturns }) => {
  const ticker = useMemo(
    () => (data.length > 0 ? data[0].ticker : 'Unknown'),
    [data]
  );

  // Perform general stock data analysis
  const stockAnalysis = useMemo(() => analyzeStockDataForTicker(data), [data]);

  // Perform daily returns analysis
  const returnsAnalysis = useMemo(
    () => analyzeDailyReturns(dailyReturns),
    [dailyReturns]
  );

  if (!stockAnalysis || !returnsAnalysis) return null;

  return (
    <Card className="h-full w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Stock Analysis for {ticker}</CardTitle>
        <CardDescription>
          Date Range: {stockAnalysis.startDate} to {stockAnalysis.endDate}
        </CardDescription>
      </CardHeader>

      <CardContent className="border-t bg-muted pt-4">
        <Table className="w-full min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Metric</TableHead>
              <TableHead className="font-bold">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Trend</TableCell>
              <TableCell className="capitalize">
                {stockAnalysis.trend}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Average Opening Price</TableCell>
              <TableCell>{stockAnalysis.avgOpen.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Average High Price</TableCell>
              <TableCell>{stockAnalysis.avgHigh.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Average Low Price</TableCell>
              <TableCell>{stockAnalysis.avgLow.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Average Closing Price</TableCell>
              <TableCell>{stockAnalysis.avgClose.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Highest Price</TableCell>
              <TableCell>{stockAnalysis.highestPrice.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Lowest Price</TableCell>
              <TableCell>{stockAnalysis.lowestPrice.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total Volume Traded</TableCell>
              <TableCell>
                {stockAnalysis.totalVolume.toLocaleString()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Volatility</TableCell>
              <TableCell>{stockAnalysis.volatility.toFixed(2)}</TableCell>
            </TableRow>

            {/* Daily Returns Analysis Metrics */}
            <TableRow>
              <TableCell>Average Daily Return</TableCell>
              <TableCell>
                {returnsAnalysis.averageReturn?.toFixed(4)}%
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Standard Deviation of Returns</TableCell>
              <TableCell>
                {returnsAnalysis.standardDeviation?.toFixed(4)}%
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Maximum Daily Return</TableCell>
              <TableCell>{returnsAnalysis.maxReturn?.toFixed(4)}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Minimum Daily Return</TableCell>
              <TableCell>{returnsAnalysis.minReturn?.toFixed(4)}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Cumulative Return</TableCell>
              <TableCell>
                {((returnsAnalysis.cumulativeReturn || 0) * 100).toFixed(2)}%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TickerStockChartAnalysis;

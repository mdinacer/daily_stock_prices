'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { StockDailyReturn } from '@/models/stock-daily-returns';
import { format } from 'date-fns';

const chartConfig = {
  value: {
    label: 'Daily Return',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

interface Props {
  ticker: string;
  chartData: Array<StockDailyReturn>;
  startDate: Date;
  endDate: Date;
}

const TickerDailyReturnChart: React.FC<Props> = ({
  ticker,
  chartData,
  startDate,
  endDate
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Daily Returns for {ticker} ({format(startDate, 'MMM dd, yyyy')} -{' '}
          {format(endDate, 'MMM dd, yyyy')})
        </CardTitle>
        <CardDescription>
          Visualizing the daily returns of {ticker} stock from{' '}
          {format(startDate, 'MMM dd, yyyy')} to{' '}
          {format(endDate, 'MMM dd, yyyy')}. This chart displays the percentage
          change in stock price each day.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="value"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar dataKey={'value'} fill={`var(--color-value)`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TickerDailyReturnChart;

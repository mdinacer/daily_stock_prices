'use client';

import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { format } from 'date-fns';

type ChartDataType = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

const chartConfig = {
  high: {
    label: 'High',
    color: 'hsl(var(--chart-1))'
  },
  low: {
    label: 'Low',
    color: 'hsl(var(--chart-2))'
  },
  open: {
    label: 'Open',
    color: 'hsl(var(--chart-3))'
  },
  close: {
    label: 'Close',
    color: 'hsl(var(--chart-4))'
  }
} satisfies ChartConfig;

interface Props {
  ticker: string;
  chartData: Array<ChartDataType>;
  startDate: Date;
  endDate: Date;
}
const TickerGeneralDataChart: React.FC<Props> = ({
  ticker,
  chartData,
  startDate,
  endDate
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Stock Data for {ticker} - {format(startDate, 'MMM dd, yyyy')} to{' '}
          {format(endDate, 'MMM dd, yyyy')}
        </CardTitle>
        <CardDescription>
          {ticker} stock price trends from {format(startDate, 'MMM dd, yyyy')}{' '}
          to {format(endDate, 'MMM dd, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
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
              tickFormatter={(value: string) => format(new Date(value), 'PP')}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="open"
              type="monotone"
              stroke="var(--color-open)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="close"
              type="monotone"
              stroke="var(--color-close)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="high"
              type="monotone"
              stroke="var(--color-high)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="low"
              type="monotone"
              stroke="var(--color-low)"
              strokeWidth={2}
              dot={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TickerGeneralDataChart;

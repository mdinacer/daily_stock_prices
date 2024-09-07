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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { StockData } from '@/models/stock-data';
import { transformToChartData } from '@/services/stock_to_chart_data';
import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartConfig: ChartConfig = {
  AAL: {
    label: 'AAL',
    color: 'hsl(var(--chart-1))'
  },
  AAPL: {
    label: 'AAPL',
    color: 'hsl(var(--chart-2))'
  },
  GOOGL: {
    label: 'GOOGL',
    color: 'hsl(var(--chart-3))'
  },
  MSFT: {
    label: 'MSFT',
    color: 'hsl(var(--chart-4))'
  },
  NFLX: {
    label: 'NFLX',
    color: 'hsl(var(--chart-5))'
  },
  TSLA: {
    label: 'TSLA',
    color: 'hsl(var(--chart-6))'
  }
};

interface Props {
  data: Array<StockData>;
}

type AnalysisType = 'open' | 'high' | 'low' | 'close';

const StockComparisonChart: React.FC<Props> = ({ data }) => {
  const [analysisType, setAnalysisType] = useState<AnalysisType>('open');

  const chartData = useMemo(
    () => transformToChartData(data, analysisType),
    [analysisType, data]
  );

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Stock Comparison Chart</CardTitle>
          <CardDescription>
            Showing stock price data for selected analysis type
          </CardDescription>
        </div>
        <Select
          value={analysisType}
          onValueChange={(value: AnalysisType) => setAnalysisType(value)}
        >
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select analysis type"
          >
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="open" className="rounded-lg">
              Open
            </SelectItem>
            <SelectItem value="high" className="rounded-lg">
              High
            </SelectItem>
            <SelectItem value="low" className="rounded-lg">
              Low
            </SelectItem>
            <SelectItem value="close" className="rounded-lg">
              Close
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              {Object.entries(chartConfig).map(([key, { color }]) => (
                <linearGradient
                  id={`fill-${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                  key={key}
                >
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
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
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            {Object.keys(chartConfig).map((key) => (
              <Area
                key={key}
                dataKey={key}
                type="natural"
                fill={`url(#fill-${key})`}
                stroke={chartConfig[key as keyof ChartConfig].color}
                stackId={'a'}
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default StockComparisonChart;

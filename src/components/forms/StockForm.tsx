'use client';
import { calculateReturns } from '@/actions/calculateReturns';
import { getStockData } from '@/actions/getStockData';
import DateRangePicker from '@/components/forms/DateRangePicker';
import TickerSelect from '@/components/forms/TickerSelect';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useStockMetadata } from '@/hooks/useStockMetadata';
import { StockDailyReturn } from '@/models/stock-daily-returns';
import { StockData } from '@/models/stock-data';
import { StockDataParams } from '@/models/stock-data-params';
import {
  StockFormSchema,
  StockFormSchemaDataType
} from '@/schemas/stock-form-shcema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
  onSubmit: (data: Array<StockData>, returns: Array<StockDailyReturn>) => void;
}

const StockForm: React.FC<Props> = ({ onSubmit }) => {
  const { stockMetadata, status } = useStockMetadata();

  const form = useForm<StockFormSchemaDataType>({
    resolver: zodResolver(StockFormSchema),
    defaultValues: {
      ticker: '',
      range: {
        from: new Date()
      }
    }
  });

  const { control, handleSubmit, setValue } = form;

  const handleOnSubmit = useCallback(
    async (data: StockFormSchemaDataType) => {
      try {
        const { ticker, range } = data;
        const params: StockDataParams = {
          ticker,
          startDate: range?.from?.toISOString(),
          endDate: range?.to?.toISOString()
        };
        const dataResult = await getStockData(params);

        const dailyReturns = await calculateReturns(params);

        onSubmit(dataResult, dailyReturns);
      } catch (error: any) {
        console.error(error);
      }
    },
    [onSubmit]
  );

  useEffect(() => {
    if (status.loaded && stockMetadata.minDate) {
      setValue('range.from', stockMetadata.minDate);
      setValue('range.to', stockMetadata.maxDate);
    }
  }, [status.loaded, stockMetadata.minDate, stockMetadata.maxDate, setValue]);

  if (status.loading) return <div>Loading...</div>;
  if (status.error) return <div>Error: {status.error}</div>;

  return (
    <Card className="mx-auto flex flex-col gap-y-4">
      <CardHeader>
        <CardTitle>Stock Data Form</CardTitle>
        <CardDescription>
          Select a stock ticker and date range to view the stock data.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="grid gap-4">
          <CardContent className="grid w-full grid-cols-1 items-center gap-4 sm:grid-cols-2">
            <TickerSelect
              control={control}
              name="ticker"
              metadata={stockMetadata}
            />

            <DateRangePicker
              control={control}
              name="range"
              metadata={stockMetadata}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Submit</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default StockForm;

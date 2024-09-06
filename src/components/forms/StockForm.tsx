'use client';
import { getStockData } from '@/actions/getStockData';
import { getMetadata } from '@/actions/getStockMetadata';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { StockData } from '@/models/stock-data';
import { StockMetadata } from '@/models/stock-data-params';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

const rangeSchema = z.object({
  from: z.date().optional(),
  to: z.date().optional()
});

const formSchema = z.object({
  ticker: z.string().min(1, { message: 'Ticker is required' }),
  range: rangeSchema.optional()
});

type FormData = z.infer<typeof formSchema>;

const useStockMetadata = () => {
  const [status, setStatus] = useState<{
    loaded: boolean;
    loading: boolean;
    error?: string;
  }>({
    loaded: false,
    loading: false,
    error: undefined
  });
  const [stockMetadata, setStockMetaData] = useState<StockMetadata>({
    tickers: [],
    columns: [],
    minDate: undefined,
    maxDate: undefined
  });

  const loadMetaData = useCallback(async () => {
    setStatus({ loaded: false, loading: true });
    try {
      const data = await getMetadata();
      setStockMetaData(data);
      setStatus({ loaded: true, loading: false });
    } catch (error: any) {
      console.error(error);
      setStatus({ loaded: true, loading: false, error: error.message });
    }
  }, []);

  return { stockMetadata, status, loadMetaData };
};

interface Props {
  onSubmit: (data: Array<StockData>) => void;
}

const StockForm: React.FC<Props> = ({ onSubmit }) => {
  const { stockMetadata, status, loadMetaData } = useStockMetadata();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticker: '',
      range: {
        from: new Date()
      }
    }
  });

  const { control, handleSubmit, setValue } = form;

  const handleOnSubmit = useCallback(
    async (data: FormData) => {
      try {
        const { ticker, range } = data;
        const result = await getStockData({
          ticker,
          startDate: range?.from?.toISOString(),
          endDate: range?.to?.toISOString()
        });

        onSubmit(result);
      } catch (error: any) {
        console.error(error);
      }
    },
    [onSubmit]
  );

  useEffect(() => {
    loadMetaData();
  }, [loadMetaData]);

  useEffect(() => {
    if (status.loaded && stockMetadata.minDate) {
      setValue('range.from', stockMetadata.minDate);
      setValue('range.to', stockMetadata.maxDate);
    }
  }, [status.loaded, stockMetadata.minDate, stockMetadata.maxDate, setValue]);

  if (status.loading) return <div>Loading...</div>;
  if (status.error) return <div>Error: {status.error}</div>;

  return (
    <Card className="mx-auto flex w-full flex-col gap-y-4">
      <CardHeader>
        <CardTitle>Stock Data Form</CardTitle>
        <CardDescription>
          Select a stock ticker and date range to view the stock data.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <CardContent className="grid w-full grid-cols-2 items-center gap-4">
            <FormField
              control={control}
              name="ticker"
              render={({ field }) => (
                <FormItem className="w-full max-w-sm">
                  <FormLabel>Stock Ticker</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a ticker" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {stockMetadata.tickers.map((ticker) => (
                        <SelectItem key={ticker} value={ticker}>
                          {ticker}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the stock ticker for which you want to retrieve data.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="range"
              render={({ field }) => (
                <FormItem className="mt-2 flex flex-col">
                  <FormLabel>Date Range</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          id="date"
                          variant={'outline'}
                          className={cn(
                            'w-[300px] justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value?.from ? (
                            field.value.to ? (
                              <>
                                {format(field.value.from, 'LLL dd, y')} -{' '}
                                {format(field.value.to, 'LLL dd, y')}
                              </>
                            ) : (
                              format(field.value.from, 'LLL dd, y')
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={field.value?.from}
                        selected={
                          field.value
                            ? ({
                                from: field.value.from,
                                to: field.value.to
                              } as DateRange)
                            : undefined
                        }
                        onSelect={field.onChange}
                        numberOfMonths={2}
                        disabled={(date) => {
                          if (
                            stockMetadata?.minDate &&
                            date < stockMetadata.minDate
                          ) {
                            return true;
                          }
                          if (
                            stockMetadata?.maxDate &&
                            date > stockMetadata.maxDate
                          ) {
                            return true;
                          }
                          return false;
                        }}
                      />
                    </PopoverContent>
                  </Popover>

                  <FormDescription>
                    Select the date range for which you want to retrieve stock
                    data.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
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

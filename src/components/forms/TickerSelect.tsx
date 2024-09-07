'use client';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { StockMetadata } from '@/models/stock-data-params';
import { Control, FieldValues, Path } from 'react-hook-form';

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  metadata: StockMetadata;
}

const TickerSelect = <T extends FieldValues>({
  control,
  name,
  metadata
}: Props<T>) => {
  return (
    <FormField
      control={control}
      name={name}
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
              {metadata.tickers.map((ticker) => (
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
  );
};

export default TickerSelect;

'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
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
import { cn } from '@/lib/utils';
import { StockMetadata } from '@/models/stock-data-params';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Control, FieldValues, Path } from 'react-hook-form';

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  metadata: StockMetadata;
}

const DateRangePicker = <T extends FieldValues>({
  control,
  name,
  metadata
}: Props<T>) => {
  return (
    <FormField
      control={control}
      name={name}
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
                  if (metadata?.minDate && date < metadata.minDate) {
                    return true;
                  }
                  if (metadata?.maxDate && date > metadata.maxDate) {
                    return true;
                  }
                  return false;
                }}
              />
            </PopoverContent>
          </Popover>

          <FormDescription>
            Select the date range for which you want to retrieve stock data.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DateRangePicker;

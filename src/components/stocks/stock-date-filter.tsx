'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange, Matcher } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Table } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface Props<TData> {
  from: Date;
  to: Date;
  table: Table<TData>;
}

export function StockDateFilter<TData>({ from, to, table }: Props<TData>) {
  const [date, setDate] = useState<DateRange | undefined>({
    from,
    to
  });

  const handleFilterData = useCallback(
    async (date: DateRange) => {
      const column = table.getColumn('date');
      if (!column) return;

      column?.setFilterValue(date);
    },
    [table]
  );

  const matcher: Matcher | undefined = useMemo(() => {
    const column = table.getColumn('date');
    if (!column) return undefined;
    const allValues = column?.getFacetedUniqueValues() ?? new Map();

    const allDates = Array.from(allValues.keys(), (value) => {
      const date = new Date(value);
      return isNaN(date.getTime()) ? undefined : date;
    }).filter((date): date is Date => date !== undefined); // Filter out invalid dates

    if (allDates.length === 0) {
      return undefined;
    }

    const maxV = new Date(Math.max(...allDates.map((date) => date.getTime())));
    const minV = new Date(Math.min(...allDates.map((date) => date.getTime())));

    return {
      before: minV,
      after: maxV
    };
  }, [table]);

  useEffect(() => {
    if (date) {
      handleFilterData(date);
    }
  }, [date]);

  return (
    <div className={cn('grid gap-2')}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            disabled={matcher}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

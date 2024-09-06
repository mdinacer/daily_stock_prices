import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Table } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';
interface Props<TData> {
  table: Table<TData>;
}

const StockDataTableTickerFilter = <TData,>({ table }: Props<TData>) => {
  const handleStockChange = useCallback(
    (stock: string) => {
      const column = table.getColumn('ticker');
      if (!column) return;

      column.setFilterValue(stock);
    },
    [table]
  );

  const tickers = useMemo(() => {
    const values = table
      .getCoreRowModel()
      .flatRows.map((row) => row.getValue('ticker')) as string[];
    return Array.from(new Set(values));
  }, [table.getState()]);

  return (
    <Select
      defaultValue={table.getColumn('ticker')?.getFilterValue() as string}
      onValueChange={(value) => {
        if (value === 'all') {
          handleStockChange('');
        } else {
          handleStockChange(value);
        }
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a stock" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Stocks</SelectLabel>

          <SelectItem value={'all'}>All</SelectItem>
          {tickers.map((ticker) => (
            <SelectItem value={ticker} key={ticker}>
              {ticker}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default StockDataTableTickerFilter;

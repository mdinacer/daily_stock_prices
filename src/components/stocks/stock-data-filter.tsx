import { Table } from '@tanstack/react-table';
import StockDataTableTickerFilter from './stock-data-table-ticker-filter';
import { StockDataTableViewOptions } from './stock-data-table-view-options';
import { StockDateFilter } from './stock-date-filter';

interface Props<TData> {
  table: Table<TData>;
}

const StockDataFilter = <TData,>({ table }: Props<TData>) => {
  return (
    <div className="flex items-center gap-4 py-4">
      <StockDataTableTickerFilter table={table} />
      {/* <Input
        placeholder="Filter actions..."
        value={table.getColumn('ticker')?.getFilterValue() as string}
        onChange={(event) =>
          table.getColumn('ticker')?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      /> */}
      <StockDateFilter
        table={table}
        from={new Date(2023, 1, 1)}
        to={new Date(2023, 4, 6)}
      />

      <StockDataTableViewOptions table={table} />
    </div>
  );
};

export default StockDataFilter;

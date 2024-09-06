import ColumnAction from '@/components/stocks/actions-column';
import { Checkbox } from '@/components/ui/checkbox';
import { StockData } from '@/models/stock-data';
import { ColumnDef, Row } from '@tanstack/react-table';
import { DataTableColumnHeader } from './stock-data-table-column-header';
import { DateRange } from 'react-day-picker';

export const isWithinRange = (
  row: Row<StockData>,
  columnId: string,
  values: DateRange
) => {
  const { from, to } = values;
  const date = new Date(row.getValue(columnId));
  if (from && !to) return true;
  if ((from || to) && !date) return false;
  if (from && !to) {
    return date.getTime() >= from.getTime();
  } else if (!from && to) {
    return date.getTime() <= to.getTime();
  } else if (from && to) {
    return date.getTime() >= from.getTime() && date.getTime() <= to.getTime();
  } else return true;
};

export const columns: Array<ColumnDef<StockData, string | number | Date>> = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'index',
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />
  },

  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    filterFn: isWithinRange
  },
  {
    accessorKey: 'open',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Open" />
    )
  },
  {
    accessorKey: 'high',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="High" />
    )
  },
  {
    accessorKey: 'low',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Low" />
    )
  },
  {
    accessorKey: 'close',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Close" />
    )
  },
  {
    accessorKey: 'volume',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Volume" />
    )
  },
  {
    accessorKey: 'ticker',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ticker" />
    )
    //getUniqueValues: (row: Row<StockData>) => row.getUniqueValues('ticker')
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const stock = row.original;

      return <ColumnAction stock={stock} />;
    }
  }
];

export default columns;

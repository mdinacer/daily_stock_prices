import { z } from 'zod';

export const DateRangeSchema = z.object({
  from: z.date().optional(),
  to: z.date().optional()
});



export const StockFormSchema = z.object({
  ticker: z.string().min(1, { message: 'Ticker is required' }),
  range: DateRangeSchema.optional()
});

export type StockFormSchemaDataType = z.infer<typeof StockFormSchema>;

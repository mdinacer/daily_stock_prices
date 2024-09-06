import { z } from 'zod';

export const stockDataSchema = z.object({
    index: z.coerce.number(),
    date: z.string(),
    open: z.coerce.number(),
    high: z.coerce.number(),
    low: z.coerce.number(),
    close: z.coerce.number(),
    volume: z.coerce.number(),
    ticker: z.string(),
});

export type StockData = z.infer<typeof stockDataSchema>;
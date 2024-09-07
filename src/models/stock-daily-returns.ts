import { z } from "zod"

export const StockDailyReturnSchema = z.object({
    date: z.string(),
    value: z.number()
  })
  
  export type StockDailyReturn = z.infer<typeof StockDailyReturnSchema>
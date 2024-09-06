import { z } from "zod"

// { date: string; dailyReturn: number }
export const StockDailyReturnSchema = z.object({
    date: z.string(),
    dailyReturn: z.number()
  })
  
  export type StockDailyReturn = z.infer<typeof StockDailyReturnSchema>
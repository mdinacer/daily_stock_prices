import { StockDailyReturn } from '@/models/stock-daily-returns';
import { StockData } from '@/models/stock-data';
import { format } from 'date-fns';

/**
 * Analyzes daily returns to calculate various metrics.
 * 
 * @param returns - An array of daily return objects, each containing a date and return value.
 * @returns An object containing the calculated metrics: averageReturn, standardDeviation, maxReturn, minReturn, and cumulativeReturn.
 */
export function analyzeDailyReturns(returns: Array<StockDailyReturn>) {
    if (returns.length === 0) {
      return {
        averageReturn: undefined,
        standardDeviation: undefined,
        maxReturn: undefined,
        minReturn: undefined,
        cumulativeReturn: undefined,
      };
    }
  
    // Extract return values
    const values = returns.map(r => r.value);
  
    // Calculate average return
    const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
  
    // Calculate variance and standard deviation
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
  
    // Calculate maximum and minimum returns
    const maxReturn = Math.max(...values);
    const minReturn = Math.min(...values);
  
    // Calculate cumulative return
    const cumulativeReturn = values.reduce((acc, val) => acc * (1 + val / 100), 1) - 1;
  
    return {
      averageReturn: mean,
      standardDeviation: stdDev,
      maxReturn,
      minReturn,
      cumulativeReturn,
    };
  }




/**
 * Analyzes stock data for a particular ticker.
 *
 * @param {Array<StockData>} data - Array of stock data objects.
 * @param {string} ticker - The stock ticker to analyze.
 * @returns {Object | undefined} An object containing the analysis results, or undefined if no data is provided.
 */
export function analyzeStockDataForTicker(data: Array<StockData>) {
  // Filter the data for the specified ticker


  // Extract date and price information from the filtered data
  const dates = data.map(stock => new Date(stock.date));
  const opens = data.map(stock => stock.open);
  const highs = data.map(stock => stock.high);
  const lows = data.map(stock => stock.low);
  const closes = data.map(stock => stock.close);
  const volumes = data.map(stock => stock.volume);

  // Helper functions
  const average = (arr: number[]) => arr.reduce((sum, value) => sum + value, 0) / arr.length;
  const highest = (arr: number[]) => Math.max(...arr);
  const lowest = (arr: number[]) => Math.min(...arr);
  const calculateReturns = (prices: number[]) => prices.slice(1).map((price, index) => (price - prices[index]) / prices[index]);

  // Calculate average values for open, high, low, and close prices
  const avgOpen = average(opens);
  const avgHigh = average(highs);
  const avgLow = average(lows);
  const avgClose = average(closes);

  // Determine the highest and lowest prices
  const highestPrice = highest(highs);
  const lowestPrice = lowest(lows);

  // Calculate the total volume traded
  const totalVolume = volumes.reduce((sum, volume) => sum + volume, 0);

  // Format start and end dates
  const startDate = format(dates[dates.length - 1], 'MMM dd, yyyy');
  const endDate = format(dates[0], 'MMM dd, yyyy');

  // Determine the trend based on the first and last close prices
  const trend = closes[0] > closes[closes.length - 1] ? 'downward' : 'upward';

  // Calculate volatility as the difference between the highest and lowest prices
  const volatility = highestPrice - lowestPrice;

  // Calculate daily returns
  const returns = calculateReturns(closes);

  return {
    startDate,
    endDate,
    trend,
    avgOpen,
    avgHigh,
    avgLow,
    avgClose,
    highestPrice,
    lowestPrice,
    totalVolume,
    volatility,
    returns
  };
}


'use server';

import { StockData } from '@/models/stock-data';
import { StockDataParams } from '@/models/stock-data-params';
import { getData } from '@/services/csv_to_stock_data';

/**
 * Filters and retrieves stock data based on provided parameters (Stock Ticker, Start Date, and End Date).
 * 
 * @param {StockDataParams} params - The filtering parameters including ticker, startDate, and endDate.
 * 
 * @returns {Promise<Array<StockData>>} A promise that resolves to an array of filtered StockData objects.
 * 
 * @throws Will throw an error if data retrieval or filtering fails.
 */
export async function getStockData(
  params: StockDataParams
): Promise<Array<StockData>> {

  try {
    // Retrieve all stock data using the getData function
    const allStockData = await getData();

    const { ticker, startDate, endDate } = params;

    // Filter the data based on the provided parameters
    const filteredResults = allStockData.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        record.ticker === ticker &&
        (!startDate || recordDate >= new Date(startDate)) &&
        (!endDate || recordDate <= new Date(endDate))
      );
    });

    return filteredResults;
  } catch (error) {
    console.error('Error retrieving or filtering stock data:', error);
    throw new Error('Failed to retrieve or filter stock data.');
  }
}

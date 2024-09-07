'use server';

import fs from 'fs';
import { parse } from 'csv-parse';
import { StockDailyReturn } from '@/models/stock-daily-returns';
import { StockDataParams } from '@/models/stock-data-params';
import { StockData, stockDataSchema } from '@/models/stock-data'; // Ensure this model is correct

const FILE_PATH = 'src/data/stock-prices.csv';

/**
 * Calculates daily returns for a given stock within a specified date range.
 *
 * @param {StockDataParams} params - The parameters including ticker, startDate, and endDate.
 * @returns {Promise<Array<{ date: string; value: number }>>} A promise that resolves to an array of objects with date and daily return values.
 * 
 * @throws Will throw an error if data retrieval, filtering, or calculation fails.
 */
export async function calculateReturns(params: StockDataParams): Promise<Array<StockDailyReturn>> {
  try {
    // Read the contents of the CSV file as a UTF-8 encoded string
    const fileContent = fs.readFileSync(FILE_PATH, 'utf-8');

    // Array to store the parsed and validated stock data records
    const results: Array<StockData> = [];

    // Return a promise that handles the CSV parsing
    await new Promise<void>((resolve, reject) => {
      const parser = parse({
        columns: (header) => {
          // Normalize header names by trimming whitespace and converting to lowercase
          return header.map((col: string) =>
            col.trim().toLowerCase() === '' ? 'index' : col.trim().toLowerCase()
          );
        },
        skip_empty_lines: true
      });

      parser.on('readable', () => {
        let record;
        while ((record = parser.read()) !== null) {
          try {
            const mappedRecord: StockData = {
              index: record.index ?? '',
              date: record.date ?? '',
              open: parseFloat(record.open) || 0,
              high: parseFloat(record.high) || 0,
              low: parseFloat(record.low) || 0,
              close: parseFloat(record.close) || 0,
              volume: parseInt(record.volume, 10) || 0,
              ticker: record.ticker ?? ''
            };

            const parsedRecord = stockDataSchema.parse(mappedRecord);
            results.push(parsedRecord);
          } catch (validationError) {
            console.error('Validation error:', validationError);
          }
        }
      });

      parser.on('end', () => {
        resolve();
      });

      parser.on('error', (error) => {
        console.error('Error occurred during CSV parsing:', error);
        reject(new Error('Failed to parse the CSV file.'));
      });

      parser.write(fileContent);
      parser.end();
    });

    const { ticker, startDate, endDate } = params;

    const filteredData = results.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        record.ticker === ticker &&
        (!startDate || recordDate >= new Date(startDate)) &&
        (!endDate || recordDate <= new Date(endDate))
      );
    });

    filteredData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (filteredData.length < 2) {
      return [];
    }

    const returns: Array<{ date: string; value: number }> = [];

    for (let i = 1; i < filteredData.length; i++) {
      const previousClose = filteredData[i - 1].close;
      const currentClose = filteredData[i].close;
      const currentDate = filteredData[i].date;

      const dailyReturn = ((currentClose - previousClose) / previousClose) * 100;

      returns.push({ date: currentDate, value: dailyReturn });
    }

    return returns;
  } catch (error) {
    console.error('Error retrieving or calculating returns:', error);
    throw new Error('Failed to retrieve or calculate daily returns.');
  }
}

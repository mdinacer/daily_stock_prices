// /src/app/actions/getStockData.ts

'use server';

import { StockData, stockDataSchema } from '@/models/stock-data';
import {
  StockDataParams
} from '@/models/stock-data-params';
import { parse } from 'csv-parse';
import fs from 'fs';

export async function getStockData(
  params: StockDataParams
): Promise<Array<StockData>> {
  const filePath = 'src/data/stock-prices.csv';

  try {
    // Read the CSV file content
    const fileContent = fs.readFileSync(filePath, 'utf-8');

   

    const { ticker, startDate, endDate } = params;

    const results: StockData[] = [];

    return new Promise((resolve, reject) => {
      const parser = parse({
        columns: (header) => {
          // Rename the 'index' column to 'id'
          return header.map((col: string) =>
            col.trim().toLowerCase() === '' ? 'index' : col.trim().toLowerCase()
          );
        },
        skip_empty_lines: true
      });

      parser.write(fileContent);
      parser.end();

      parser.on('readable', () => {
        let record;
        while ((record = parser.read()) !== null) {
          try {
            // Map CSV columns to the schema
            const mappedRecord: StockData = {
              index: record.index ?? '',
              date: record.date ?? '',
              open: record.open,
              high: record.high,
              low: record.low,
              close: record.close,
              volume: record.volume,
              ticker: record.ticker ?? ''
            };

            // Parse and validate each record using Zod
            const parsedRecord = stockDataSchema.parse(mappedRecord);

            // Filter records based on ticker and optional date range
            if (
              parsedRecord.ticker === ticker &&
              (!startDate ||
                new Date(parsedRecord.date) >= new Date(startDate)) &&
              (!endDate || new Date(parsedRecord.date) <= new Date(endDate))
            ) {
              results.push(parsedRecord);
            }
          } catch (validationError) {
            console.error('Validation error:', validationError);
          }
        }
      });

      parser.on('end', () => {
        resolve(results);
      });

      parser.on('error', (error) => {
        console.error('Error occurred during CSV parsing:', error);
        reject(new Error('Failed to parse the CSV file.'));
      });
    });
  } catch (error: any) {
    console.error('Error reading the CSV file:', error);
      throw new Error('Failed to read the CSV file.');
  }
}

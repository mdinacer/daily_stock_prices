// /src/app/actions/getStockData.ts

'use server';

import fs from 'fs';
import { parse } from 'csv-parse';
import { z } from 'zod';
import { StockData, stockDataSchema } from '@/models/StockData';

export async function getStockData(): Promise<Array<StockData>> {
  const filePath = 'src/data/stock-prices.csv';

  try {
    // Read the CSV file content
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    return new Promise((resolve, reject) => {
      const results: StockData[] = [];

      const parser = parse({
        columns: (header) => {
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
            const mappedRecord = {
              index: record.index ?? '',
              date: record.date ?? '',
              open: record.open,
              high: record.high,
              low: record.low,
              close: record.close,
              volume: record.volume,
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
        resolve(results);
      });

      parser.on('error', (error) => {
        reject(new Error(`Failed to parse the CSV file. ${error}`));
      });
    });
  } catch (error) {
    console.error('Error reading the CSV file:', error);
    throw new Error('Failed to read the CSV file.');
  }
}

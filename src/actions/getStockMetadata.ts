'use server';

import { StockMetadata } from '@/models/stock-data-params';
import { parse } from 'csv-parse';
import fs from 'fs';

/**
 * Retrieves metadata from a stock prices CSV file, including a list of tickers, column names, 
 * and the range of dates (minimum and maximum).
 * 
 * @returns {Promise<StockMetadata>} A promise that resolves to an object containing:
 * - `tickers`: An array of unique ticker symbols.
 * - `columns`: An array of column names extracted from the CSV file.
 * - `minDate`: The earliest date in the data, or `undefined` if no dates are found.
 * - `maxDate`: The latest date in the data, or `undefined` if no dates are found.
 * 
 * @throws Will throw an error if the CSV file cannot be read or parsed.
 */
export async function getMetadata(): Promise<StockMetadata> {
  const filePath = 'src/data/stock-prices.csv';

  try {
    // Read the content of the CSV file synchronously
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const tickers = new Set<string>(); // Set to store unique tickers
    let columns: string[] = []; // Array to store column names
    let records: { ticker: string; date: string }[] = []; // Array to store records for date sorting

    return new Promise((resolve, reject) => {
      const parser = parse({
        columns: (header) => {
          // Process the header row to extract column names
          columns = header.map((col: string) =>
            col.trim().toLowerCase() === '' ? 'index' : col.trim().toLowerCase()
          );
          return columns;
        },
        skip_empty_lines: true
      });

      parser.write(fileContent); // Write the file content to the parser
      parser.end(); // Signal the end of data writing

      parser.on('readable', () => {
        let record;
        // Process each record in the CSV file
        while ((record = parser.read()) !== null) {
          try {
            const ticker = record.ticker?.trim() ?? '';
            const dateStr = record.date?.trim() ?? '';

            // If both ticker and date are present, add them to the collections
            if (ticker && dateStr) {
              tickers.add(ticker);
              records.push({ ticker, date: dateStr });
            }
          } catch (error) {
            // Log any errors encountered while processing a record
            console.error('Error processing record:', error);
          }
        }
      });

      parser.on('end', () => {
        // Sort records by date in ascending order
        records = records.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        // Determine the minimum and maximum dates from the sorted records
        const minDate =
          records.length > 0 ? new Date(records[0].date) : undefined;
        const maxDate =
          records.length > 0
            ? new Date(records[records.length - 1].date)
            : undefined;

        // Resolve the promise with the extracted metadata
        resolve({
          tickers: Array.from(tickers),
          columns,
          minDate,
          maxDate
        });
      });

      parser.on('error', (error) => {
        // Handle any errors during CSV parsing
        console.error('Error occurred during CSV parsing:', error);
        reject(new Error('Failed to parse the CSV file.'));
      });
    });
  } catch (error: any) {
    // Log and throw an error if the CSV file cannot be read
    console.error('Error reading the CSV file:', error);
    throw new Error('Failed to read the CSV file.');
  }
}

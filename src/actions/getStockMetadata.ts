'use server';

import { parse } from 'csv-parse';
import fs from 'fs';

export async function getMetadata(): Promise<{
  tickers: string[];
  columns: string[];
  minDate: Date | undefined;
  maxDate: Date | undefined;
}> {
  const filePath = 'src/data/stock-prices.csv';

  try {
    // Read the CSV file content
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const tickers = new Set<string>();
    let columns: string[] = [];
    let records: { ticker: string; date: string }[] = [];

    return new Promise((resolve, reject) => {
      const parser = parse({
        columns: (header) => {
          // Store column names
          columns = header.map((col: string) =>
            col.trim().toLowerCase() === '' ? 'index' : col.trim().toLowerCase()
          );
          return columns;
        },
        skip_empty_lines: true,
      });

      parser.write(fileContent);
      parser.end();

      parser.on('readable', () => {
        let record;
        while ((record = parser.read()) !== null) {
          try {
            // Extract only the necessary fields
            const ticker = record.ticker?.trim() ?? '';
            const dateStr = record.date?.trim() ?? '';

            if (ticker && dateStr) {
              tickers.add(ticker);
              records.push({ ticker, date: dateStr });
            }
          } catch (error) {
            console.error('Error processing record:', error);
          }
        }
      });

      parser.on('end', () => {
        // Ensure dates are sorted in ascending order
        records = records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Determine min and max dates
        const minDate = records.length > 0 ? new Date(records[0].date) : undefined;
        const maxDate = records.length > 0 ? new Date(records[records.length - 1].date) : undefined;

        resolve({
          tickers: Array.from(tickers),
          columns,
          minDate,
          maxDate,
        });
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

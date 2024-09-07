"use server"
import { StockData, stockDataSchema } from '@/models/stock-data';
import fs from 'fs';
import { parse } from 'csv-parse';

const FILE_PATH = 'src/data/stock-prices.csv';

/**
 * Reads and parses stock price data from a CSV file.
 * 
 * @returns {Promise<Array<StockData>>} A promise that resolves to an array of validated and parsed StockData objects.
 * 
 * @throws Will throw an error if the file cannot be read or if CSV parsing fails.
 */
export async function getData(): Promise<Array<StockData>> {
  try {
    // Read the contents of the CSV file as a UTF-8 encoded string
    const fileContent = fs.readFileSync(FILE_PATH, 'utf-8');

    // Array to store the parsed and validated stock data records
    const results: Array<StockData> = [];

    // Return a promise that handles the CSV parsing
    return new Promise((resolve, reject) => {
      const parser = parse({
        columns: (header) => {
          // Normalize header names by trimming whitespace and converting to lowercase
          // Use 'index' as the default column name if a header is empty
          return header.map((col: string) =>
            col.trim().toLowerCase() === '' ? 'index' : col.trim().toLowerCase()
          );
        },
        skip_empty_lines: true // Skip empty lines in the CSV file
      });

      // Event listener triggered when the parser reads a record from the CSV file
      parser.on('readable', () => {
        let record;
        // Read each record from the parser
        while ((record = parser.read()) !== null) {
          try {
            // Map the CSV record to the StockData interface
            const mappedRecord: StockData = {
              index: record.index ?? '',
              date: record.date ?? '',
              open: parseFloat(record.open) || 0, // Convert open price to a float
              high: parseFloat(record.high) || 0, // Convert high price to a float
              low: parseFloat(record.low) || 0,   // Convert low price to a float
              close: parseFloat(record.close) || 0, // Convert close price to a float
              volume: parseInt(record.volume, 10) || 0, // Convert volume to an integer
              ticker: record.ticker ?? ''
            };

            // Validate and parse the mapped record using the stockDataSchema
            const parsedRecord = stockDataSchema.parse(mappedRecord);
            // Add the parsed record to the results array
            results.push(parsedRecord);
          } catch (validationError) {
            // Log any validation errors without interrupting the parsing process
            console.error('Validation error:', validationError);
          }
        }
      });

      // Event listener triggered when the parser has finished processing the CSV file
      parser.on('end', () => {
        resolve(results); // Resolve the promise with the results array
      });

      // Event listener triggered if an error occurs during parsing
      parser.on('error', (error) => {
        console.error('Error occurred during CSV parsing:', error);
        reject(new Error('Failed to parse the CSV file.'));
      });

      // Write the file content to the parser and signal the end of the input
      parser.write(fileContent);
      parser.end();
    });
  } catch (error) {
    // Log any errors that occur while reading the file and throw an error
    console.error('Error occurred while reading the file:', error);
    throw new Error('Failed to read the file.');
  }
}

import fs from 'fs';
import { StockDataParams } from '@/models/stock-data-params';
import { calculateReturns } from '@/actions/calculateReturns';

// Mock CSV data
const mockCsvData = `
index,date,open,high,low,close,volume,ticker
1,2023-09-01,150,155,149,153,1000,AAPL
2,2023-09-02,153,158,152,157,1100,AAPL
3,2023-09-03,157,160,156,159,1050,AAPL
`;

jest.mock('fs');

describe('calculateReturns', () => {
  beforeEach(() => {
    // Mock fs.readFileSync to return the mockCsvData when called
    (fs.readFileSync as jest.Mock).mockReturnValue(mockCsvData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calculates daily returns for a given stock and date range', async () => {
    const params: StockDataParams = {
      ticker: 'AAPL',
      startDate: '2023-09-01',
      endDate: '2023-09-03'
    };

    const result = await calculateReturns(params);

    expect(result).toEqual([
      { date: '2023-09-02', value: ((157 - 153) / 153) * 100 },
      { date: '2023-09-03', value: ((159 - 157) / 157) * 100 }
    ]);
  });

  it('returns an empty array if no records match the ticker and date range', async () => {
    const params: StockDataParams = {
      ticker: 'MSFT',
      startDate: '2023-09-01',
      endDate: '2023-09-03'
    };

    const result = await calculateReturns(params);

    expect(result).toEqual([]);
  });

  it('returns an empty array if there is less than two records to calculate returns', async () => {
    const params: StockDataParams = {
      ticker: 'AAPL',
      startDate: '2023-09-03',
      endDate: '2023-09-03'
    };

    const result = await calculateReturns(params);

    expect(result).toEqual([]);
  });

  it('handles errors gracefully', async () => {
    // Mock an error in reading the file
    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('File read error');
    });

    const params: StockDataParams = {
      ticker: 'AAPL',
      startDate: '2023-09-01',
      endDate: '2023-09-03'
    };

    await expect(calculateReturns(params)).rejects.toThrow('Failed to retrieve or calculate daily returns.');
  });
});

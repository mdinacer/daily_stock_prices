import { getMetadata } from "@/actions/getStockMetadata";
import { StockMetadata } from "@/models/stock-data-params";
import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook to manage the loading and state of stock metadata.
 * 
 * @returns An object containing:
 *  - `stockMetadata`: The fetched stock metadata, including tickers, columns, and date range.
 *  - `status`: The loading status, including whether data is loaded, loading, or if an error occurred.
 *  - `loadMetaData`: A function to manually trigger the metadata loading process.
 */
export const useStockMetadata = () => {
  const [status, setStatus] = useState<{
    loaded: boolean;
    loading: boolean;
    error?: string;
  }>({
    loaded: false,
    loading: false,
    error: undefined
  });

  const [stockMetadata, setStockMetaData] = useState<StockMetadata>({
    tickers: [],
    columns: [],
    minDate: undefined,
    maxDate: undefined
  });

  /**
   * Function to load the stock metadata from the server.
   * Updates the status to reflect loading, success, or error states.
   */
  const loadMetaData = useCallback(async () => {
    setStatus({ loaded: false, loading: true });
    try {
      const data = await getMetadata();
      setStockMetaData(data);
      setStatus({ loaded: true, loading: false });
    } catch (error: any) {
      console.error("Failed to load stock metadata:", error);
      setStatus({ loaded: true, loading: false, error: error.message });
    }
  }, []);

  useEffect(() => {
    if (!status.loaded && !status.loading && !status.error) {
      loadMetaData();
    }
  }, [loadMetaData, status]);

  return { stockMetadata, status, loadMetaData };
};

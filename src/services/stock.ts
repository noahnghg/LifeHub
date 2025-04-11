/**
 * Represents information about a stock.
 */
export interface Stock {
  /**
   * The symbol of the stock (e.g., AAPL for Apple).
   */
  symbol: string;
  /**
   * The current price of the stock.
   */
  price: number;
}

/**
 * Asynchronously retrieves stock information for a given stock symbol.
 * @param symbol The stock symbol to look up.
 * @returns A promise that resolves to a Stock object containing the symbol and price.
 */
export async function getStock(symbol: string): Promise<Stock> {
  // TODO: Implement this by calling an API.

  return {
    symbol: symbol,
    price: 150.25,
  };
}

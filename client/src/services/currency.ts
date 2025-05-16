import { apiRequest } from "@/lib/queryClient";

/**
 * Fetches current exchange rates for various currencies
 * @returns Object containing exchange rates
 */
export async function getExchangeRates() {
  try {
    const response = await fetch("/api/currency/rates");
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }
    
    // Mock response for demo purposes
    const mockRates = {
      USD: 1,
      BRL: 5.19,
      EUR: 0.92,
      GBP: 0.8,
      JPY: 150.23,
      CAD: 1.36,
      AUD: 1.52,
      CHF: 0.89,
      CNY: 7.22,
    };
    
    return mockRates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    throw error;
  }
}

/**
 * Converts an amount from one currency to another
 * @param from Source currency code
 * @param to Target currency code
 * @param amount Amount to convert
 * @returns Converted amount
 */
export async function convertCurrency(from: string, to: string, amount: number) {
  const response = await apiRequest("POST", "/api/currency/convert", {
    from,
    to,
    amount,
  });
  return response.json();
}

/**
 * Gets the current USD to BRL conversion rate
 * @returns Current USD to BRL rate
 */
export async function getDolar() {
  const response = await fetch("/api/currency/dolar");
  
  if (!response.ok) {
    throw new Error("Failed to fetch USD rate");
  }
  
  return response.json();
}

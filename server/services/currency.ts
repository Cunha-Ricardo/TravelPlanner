import fetch from "node-fetch";
import { storage } from "../storage";

// API key for external currency service (if needed)
const API_KEY = process.env.CURRENCY_API_KEY || "";

/**
 * Fetches the latest exchange rates from the database
 * In a production app, these would be regularly updated from an external API
 * @returns An object with currency codes as keys and rates as values
 */
export async function getExchangeRates(): Promise<Record<string, number>> {
  try {
    // Get rates from storage
    const ratesList = await storage.getExchangeRates();
    
    // Convert to the expected format
    const rates: Record<string, number> = {};
    ratesList.forEach(rate => {
      rates[rate.currencyCode] = parseFloat(rate.rate);
    });
    
    return rates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    
    // Return default rates if there's an error
    return {
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
  }
}

/**
 * Converts an amount from one currency to another
 * @param from Source currency code
 * @param to Target currency code
 * @param amount Amount to convert
 * @returns Object with converted amount and related info
 */
export async function convertCurrency(
  from: string,
  to: string,
  amount: number
): Promise<{ amount: number; from: string; to: string; rate: number }> {
  try {
    const rates = await getExchangeRates();
    
    // Handle if rates don't exist
    if (!rates[from] || !rates[to]) {
      throw new Error(`Taxa de câmbio não encontrada para ${from} ou ${to}`);
    }
    
    // Convert to USD first (base currency) then to target currency
    const inUSD = amount / rates[from];
    const result = inUSD * rates[to];
    const rate = rates[to] / rates[from];
    
    return {
      amount: parseFloat(result.toFixed(2)),
      from,
      to,
      rate: parseFloat(rate.toFixed(4)),
    };
  } catch (error) {
    console.error("Error converting currency:", error);
    throw new Error(`Falha ao converter de ${from} para ${to}.`);
  }
}

/**
 * Gets the current USD to BRL exchange rate
 * @returns Current USD to BRL rate info
 */
export async function getDolarRate(): Promise<{ 
  rate: number; 
  date: string; 
  change: number;
}> {
  try {
    const rates = await getExchangeRates();
    
    // Return the USD to BRL rate
    return {
      rate: rates.BRL,
      date: new Date().toISOString(),
      change: 0.1, // Mock change percentage
    };
  } catch (error) {
    console.error("Error fetching USD rate:", error);
    
    // Return a default value if there's an error
    return {
      rate: 5.19,
      date: new Date().toISOString(),
      change: 0.1,
    };
  }
}

/**
 * Updates exchange rates from an external API
 * This would typically be run on a schedule, not on user requests
 */
export async function updateExchangeRatesFromAPI(): Promise<void> {
  try {
    // This would be an actual API call in production
    // For now, we're using mock data
    
    const mockRatesData = {
      USD: "1",
      BRL: "5.19",
      EUR: "0.92",
      GBP: "0.8",
      JPY: "150.23",
      CAD: "1.36",
      AUD: "1.52",
      CHF: "0.89",
      CNY: "7.22",
    };
    
    // Update rates in storage
    for (const [code, rate] of Object.entries(mockRatesData)) {
      await storage.updateExchangeRate(code, rate);
    }
    
    console.log("Exchange rates updated successfully");
  } catch (error) {
    console.error("Error updating exchange rates:", error);
    throw new Error("Falha ao atualizar taxas de câmbio.");
  }
}

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDolar, getExchangeRates } from "@/services/currency";
import { ArrowUpDown } from "lucide-react";

interface Currency {
  code: string;
  name: string;
  symbol?: string;
  flag?: string;
}

interface ExchangeRate {
  code: string;
  value: number;
  change?: number;
}

const Currency: React.FC = () => {
  const [fromCurrency, setFromCurrency] = useState("BRL");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState(100);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  const currencies: Currency[] = [
    { code: "BRL", name: "Real Brasileiro", symbol: "R$" },
    { code: "USD", name: "Dólar Americano", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "Libra Esterlina", symbol: "£" },
    { code: "JPY", name: "Iene Japonês", symbol: "¥" },
    { code: "CAD", name: "Dólar Canadense", symbol: "C$" },
    { code: "AUD", name: "Dólar Australiano", symbol: "A$" },
    { code: "CHF", name: "Franco Suíço", symbol: "Fr" },
    { code: "CNY", name: "Yuan Chinês", symbol: "¥" },
  ];

  // Query for exchange rates
  const { data: rates, isLoading } = useQuery({
    queryKey: ["/api/currency/rates"],
    queryFn: getExchangeRates,
  });

  useEffect(() => {
    if (rates && amount > 0) {
      const fromRate = rates[fromCurrency] || 1;
      const toRate = rates[toCurrency] || 1;
      
      // Convert to USD first (base currency) then to target currency
      const inUSD = amount / fromRate;
      const result = inUSD * toRate;
      
      setConvertedAmount(result);
    }
  }, [rates, fromCurrency, toCurrency, amount]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const formatCurrency = (value: number, currencyCode: string) => {
    const currency = currencies.find((c) => c.code === currencyCode);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Popular exchange rates to display
  const popularRates: ExchangeRate[] = [
    { code: "USD", value: 5.19, change: 0.3 },
    { code: "EUR", value: 5.63, change: -0.1 },
    { code: "GBP", value: 6.47, change: 0.2 },
    { code: "JPY", value: 0.0346, change: -0.4 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Conversor de Moedas</h2>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Converter de
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Converter para
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
                <button
                  className="absolute right-0 top-7 -mt-1 mr-12 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  onClick={handleSwapCurrencies}
                  title="Inverter moedas"
                >
                  <ArrowUpDown className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resultado
                </label>
                <div className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg font-medium">
                  {isLoading
                    ? "Carregando..."
                    : convertedAmount !== null
                    ? formatCurrency(convertedAmount, toCurrency)
                    : "Digite um valor"}
                </div>
              </div>
            </div>

            <div className="text-center">
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Converter
              </button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              Taxas de câmbio atualizadas em {new Date().toLocaleDateString("pt-BR")}. As taxas são
              informativas e podem variar ligeiramente das taxas finais.
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Taxas de câmbio populares</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularRates.map((rate) => (
              <div
                key={rate.code}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <span
                    className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${
                      rate.code === "USD"
                        ? "bg-blue-100 text-blue-600"
                        : rate.code === "EUR"
                        ? "bg-yellow-100 text-yellow-600"
                        : rate.code === "GBP"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-red-100 text-red-600"
                    } mr-3`}
                  >
                    {rate.code}
                  </span>
                  <div>
                    <div className="font-medium">
                      {currencies.find((c) => c.code === rate.code)?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {rate.code === "JPY" ? "100" : "1"} {rate.code}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {rate.code === "JPY"
                      ? formatCurrency(rate.value * 100, "BRL")
                      : formatCurrency(rate.value, "BRL")}
                  </div>
                  <div
                    className={`text-xs ${
                      rate.change && rate.change > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {rate.change && rate.change > 0 ? "+" : ""}
                    {rate.change}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Currency;

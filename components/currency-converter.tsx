"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Value } from "@radix-ui/react-select";

type ExchangeRates = {
  [key: string]: number;
};

type Currency = "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "PKR";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number | null>(null);
  const [from, setFrom] = useState<Currency>("USD");
  const [to, setTo] = useState<Currency>("PKR");
  const [convertedAmount, setConvertedAmount] = useState<string>("");
  const [exchangeRate, setExchangeRate] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const getExchangeRates = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/USD`
        );
        const data = await response.json();
        setExchangeRate(data.rates);
      } catch (error) {
        setError("Failed to fetch Exchange Rate");
      } finally {
        setLoading(false);
      }
    };

    getExchangeRates();
  }, []);

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setAmount(parseFloat(e.target.value));
  };

  const handleFrom = (value: Currency): void => {
    setFrom(value);
  };
  const handleTo = (value: Currency) => {
    setTo(value);
  };

  const convertAmount = (): void => {
    if (from && to && amount && exchangeRate) {
      const rate =
        from === "USD"
          ? exchangeRate[to]
          : exchangeRate[to] / exchangeRate[from];
      const result = amount * rate;
      setConvertedAmount(
        `${amount} ${from} to ${to} = ${convertedAmount} ${result.toFixed(2)}`
      );
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gray-100 h-screen flex justify-center items-center">
        <div className="flex flex-col justify-center p-8 rounded-lg shadow-md bg-white">
          <div>
            <h1 className="text-center text-3xl font-bold">
              Currency Converter
            </h1>
            <p className="text-center text-lg ">
              Convert between different currencies.
            </p>
          </div>
          <div>
            {loading ? (
              <div className="text-center text-blue-500 m-9">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500 m-9 ">{error}</div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-3 m-4">
                <div>
                  <Label className="text-xl font-semibold">Amount</Label>
                  <Input
                    placeholder="Enter Your Amount"
                    type="number"
                    value={amount || ""}
                    onChange={handleAmountChange}
                  />
                </div>

                <div>
                  <Label>From</Label>
                  <Select value={from} onValueChange={handleFrom}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="USD" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="PKR">PKR</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>To</Label>
                  <Select value={to} onValueChange={handleTo}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="USD" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="PKR">PKR</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="m-4 ">
              <div className="text-2xl font-bold m-2">{convertedAmount}</div>
              <Button type="button" className="w-full" onClick={convertAmount}>
                Convert
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

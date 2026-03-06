"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, Check } from "lucide-react"

interface Currency {
  code: string
  symbol: string
  name: string
  countries: string[]
}

const currencies: Currency[] = [
  { code: "INR", symbol: "₹", name: "Indian Rupee", countries: ["IN"] },
  { code: "USD", symbol: "$", name: "US Dollar", countries: ["US"] },
  { code: "EUR", symbol: "€", name: "Euro", countries: ["DE", "FR", "IT", "ES", "NL", "BE", "AT", "PT", "IE", "FI", "GR"] },
  { code: "GBP", symbol: "£", name: "British Pound", countries: ["GB"] },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", countries: ["JP"] },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", countries: ["CN"] },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", countries: ["AU"] },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", countries: ["CA"] },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc", countries: ["CH"] },
  { code: "KRW", symbol: "₩", name: "South Korean Won", countries: ["KR"] },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", countries: ["SG"] },
  { code: "MXN", symbol: "$", name: "Mexican Peso", countries: ["MX"] },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", countries: ["BR"] },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", countries: ["AE"] },
  { code: "THB", symbol: "฿", name: "Thai Baht", countries: ["TH"] },
  { code: "ZAR", symbol: "R", name: "South African Rand", countries: ["ZA"] },
  { code: "RUB", symbol: "₽", name: "Russian Ruble", countries: ["RU"] },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", countries: ["NZ"] },
]

function detectCurrencyFromLocale(): Currency {
  if (typeof window === "undefined") {
    return currencies.find((c) => c.code === "USD")!
  }

  try {
    // Get the user's locale from navigator.language
    const locale = navigator.language || "en-US"
    
    // Extract country code from locale (e.g., "en-IN" -> "IN", "en-US" -> "US")
    const parts = locale.split("-")
    const countryCode = parts.length > 1 ? parts[1].toUpperCase() : null

    // Try to find currency by country code
    if (countryCode) {
      const currencyByCountry = currencies.find((c) => 
        c.countries.includes(countryCode)
      )
      if (currencyByCountry) {
        return currencyByCountry
      }
    }

    // Fallback: Use Intl API to get region from locale
    try {
      const regionNames = new Intl.Locale(locale)
      const region = regionNames.region
      if (region) {
        const currencyByRegion = currencies.find((c) => 
          c.countries.includes(region)
        )
        if (currencyByRegion) {
          return currencyByRegion
        }
      }
    } catch {
      // Intl.Locale might not be supported in all browsers
    }

    // Additional fallback: Check timezone for India
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (timezone?.includes("Kolkata") || timezone?.includes("India")) {
      return currencies.find((c) => c.code === "INR")!
    }

  } catch {
    // If all detection fails, default to USD
  }

  return currencies.find((c) => c.code === "USD")!
}

export function CurrencySelector() {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    currencies.find((c) => c.code === "USD")!
  )
  const [isOpen, setIsOpen] = useState(false)
  const [isDetecting, setIsDetecting] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Detect currency on mount
    const detected = detectCurrencyFromLocale()
    setSelectedCurrency(detected)
    setIsDetecting(false)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (currency: Currency) => {
    setSelectedCurrency(currency)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {isDetecting ? (
          <span className="animate-pulse">Detecting...</span>
        ) : (
          <>
            <span>{selectedCurrency.symbol}</span>
            <span>{selectedCurrency.code}</span>
          </>
        )}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute bottom-full right-0 mb-2 w-56 rounded-lg border border-border bg-card py-2 shadow-xl"
          role="listbox"
          aria-label="Select currency"
        >
          <div className="max-h-64 overflow-y-auto">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleSelect(currency)}
                className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-muted ${
                  selectedCurrency.code === currency.code ? "bg-muted" : ""
                }`}
                role="option"
                aria-selected={selectedCurrency.code === currency.code}
              >
                <span className="flex items-center gap-2 text-foreground">
                  <span className="w-6 text-center font-medium">{currency.symbol}</span>
                  <span>{currency.code}</span>
                  <span className="text-muted-foreground">- {currency.name}</span>
                </span>
                {selectedCurrency.code === currency.code && (
                  <Check className="h-4 w-4 text-accent" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

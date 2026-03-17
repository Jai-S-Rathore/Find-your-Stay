"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { SearchBar } from "@/components/search-bar"
import { StaysGrid } from "@/components/stays-grid"
import { PriceComparisonGrid } from "@/components/price-comparison-grid"
import { MapSection } from "@/components/map-section"
import { ReviewSection } from "@/components/review-section"
import { Footer } from "@/components/footer"
import type { Stay } from "@/components/stay-card"
import type { AggregatedHotelPrice } from "@/components/price-comparison-card"

export default function HomePage() {
  const [stays, setStays] = useState<Stay[]>([])
  const [priceHotels, setPriceHotels] = useState<AggregatedHotelPrice[]>([])
  const [searchCity, setSearchCity] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const cityParam = searchCity && searchCity.trim().length > 0 ? searchCity.trim() : ""

        const staysUrl =
          cityParam.length > 0
            ? `http://localhost:5000/api/stays?city=${encodeURIComponent(cityParam)}`
            : "http://localhost:5000/api/stays"

        const pricesUrl =
          cityParam.length > 0
            ? `http://localhost:5000/api/compare-prices?city=${encodeURIComponent(cityParam)}`
            : `http://localhost:5000/api/compare-prices?city=Delhi`

        const [staysRes, pricesRes] = await Promise.all([fetch(staysUrl), fetch(pricesUrl)])

        if (!staysRes.ok) {
          throw new Error(`Failed to fetch stays: ${staysRes.status}`)
        }
        if (!pricesRes.ok) {
          throw new Error(`Failed to fetch price comparison: ${pricesRes.status}`)
        }

        const staysData: Stay[] = await staysRes.json()
        const pricesData = await pricesRes.json()
        setStays(staysData)
        setPriceHotels(pricesData.hotels || [])
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Unable to load data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchCity])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <SearchBar onSearch={(city) => setSearchCity(city)} />

        {loading && (
          <div className="py-8 text-center text-muted-foreground">
            Loading stays...
          </div>
        )}

        {error && !loading && (
          <div className="py-8 text-center text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <StaysGrid stays={stays} />
            <PriceComparisonGrid hotels={priceHotels} />
          </>
        )}

        <MapSection />
        <ReviewSection />
      </main>

      <Footer />
    </div>
  )
}

import { PriceComparisonCard, type AggregatedHotelPrice } from "@/components/price-comparison-card"

export function PriceComparisonGrid({ hotels }: { hotels: AggregatedHotelPrice[] }) {
  if (!hotels.length) {
    return null
  }

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">
          Live Price Comparison
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => (
            <PriceComparisonCard key={hotel.name} hotel={hotel} />
          ))}
        </div>
      </div>
    </section>
  )
}


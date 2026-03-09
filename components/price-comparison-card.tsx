import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export interface PlatformPrice {
  platform: string
  price: number | null
  booking_link?: string | null
}

export interface AggregatedHotelPrice {
  name: string
  prices: PlatformPrice[]
  rating: number | null
  image: string | null
}

export function PriceComparisonCard({ hotel }: { hotel: AggregatedHotelPrice }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-40 w-full">
        {hotel.image ? (
          <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="truncate">{hotel.name}</span>
          {hotel.rating != null && (
            <span className="text-sm font-medium text-yellow-600">
              ⭐ {hotel.rating.toFixed(1)}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {hotel.prices.map((p) => (
          <div
            key={p.platform}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-muted-foreground">{p.platform}</span>
            <div className="flex items-center gap-3">
              <span className="font-semibold">
                {p.price != null ? `₹${p.price}` : "N/A"}
              </span>
              {p.booking_link && (
                <a
                  href={p.booking_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  View Deal
                </a>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}


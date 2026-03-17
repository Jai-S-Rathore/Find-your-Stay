"use client"

import Image from "next/image"
import { Star } from "lucide-react"

// This matches what the backend actually returns
export interface Stay {
  id: number
  title: string        // backend sends "title" not "name"
  location: string     // backend sends "location" not "city"
  type: string
  image: string        // backend sends "image" not "image_url"
  prices: Array<{
    platform: string
    price: number
    logo?: string
  }>
  ratings: Array<{
    platform: string
    rating: number
    reviewCount: number
  }>
  hostContact: {
    phone: string
    email: string
    whatsapp: string
  }
}

export function StayCard({ stay }: { stay: Stay }) {
  // Get the lowest price across all platforms
  const lowestPrice =
    stay.prices && stay.prices.length > 0
      ? Math.min(...stay.prices.map((p) => Number(p.price) || 0))
      : null

  // Get the rating from the ratings array
  const rating =
    stay.ratings && stay.ratings.length > 0
      ? stay.ratings[0].rating
      : null

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={stay.image || "/images/default-stay.jpg"}
          alt={stay.title || "Stay image"}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
          {stay.type}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-foreground">
              {stay.title}
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {stay.location}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-accent/10 px-2 py-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="text-sm font-bold text-foreground">
              {rating !== null ? rating.toFixed(1) : "N/A"}
            </span>
          </div>
        </div>

        {/* Platform price badges */}
        {stay.prices && stay.prices.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {stay.prices.slice(0, 3).map((p, i) => (
              <span
                key={`${p.platform}-${i}`}
                className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {p.platform}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-sm text-muted-foreground">From</span>
          {lowestPrice !== null && lowestPrice > 0 ? (
            <span className="text-lg font-bold text-foreground">
              ₹{lowestPrice.toLocaleString("en-IN")}
            </span>
          ) : (
            <span className="text-lg font-bold text-muted-foreground">
              On request
            </span>
          )}
          <span className="text-sm text-muted-foreground">/ night</span>
        </div>
      </div>
    </article>
  )
}
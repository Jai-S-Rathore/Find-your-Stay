"use client"

import Image from "next/image"
import { Star } from "lucide-react"

export interface Stay {
  id: number
  name: string
  city: string
  type: string
  image_url: string
  overall_rating: number
  price: number
}

export function StayCard({ stay }: { stay: Stay }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={stay.image_url || "/images/default-stay.jpg"}
          alt={stay.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
          {stay.type}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-foreground">{stay.name}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">{stay.city}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-accent/10 px-2 py-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="text-sm font-bold text-foreground">
              {stay.overall_rating?.toFixed(1) ?? "0.0"}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-sm text-muted-foreground">From</span>
          <span className="text-lg font-bold text-foreground">₹{stay.price}</span>
          <span className="text-sm text-muted-foreground">/ night</span>
        </div>
      </div>
    </article>
  )
}

"use client"

import Image from "next/image"
import { Heart, Star, ExternalLink } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export type StayType = "Hotel" | "Hostel" | "Resort" | "Airbnb"

interface StayCardProps {
  id: number
  image: string
  title: string
  location: string
  type: StayType
  priceRange: string
  rating: number
  reviewCount: number
  bookingUrl: string
  platform: string
}

const typeColors: Record<StayType, string> = {
  Hotel: "bg-blue-500/10 text-blue-600 border-blue-200",
  Hostel: "bg-green-500/10 text-green-600 border-green-200",
  Resort: "bg-amber-500/10 text-amber-600 border-amber-200",
  Airbnb: "bg-rose-500/10 text-rose-600 border-rose-200",
}

export function StayCard({
  image,
  title,
  location,
  type,
  priceRange,
  rating,
  reviewCount,
  bookingUrl,
  platform,
}: StayCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-card/80 backdrop-blur transition-colors hover:bg-card"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isFavorite ? "fill-accent text-accent" : "text-foreground"
            }`}
          />
        </button>
        <div className="absolute bottom-3 left-3">
          <Badge
            variant="outline"
            className={`${typeColors[type]} border backdrop-blur`}
          >
            {type}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-foreground">{title}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">{location}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="text-sm font-medium text-foreground">{rating}</span>
            <span className="text-sm text-muted-foreground">({reviewCount})</span>
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-lg font-bold text-foreground">{priceRange}</span>
          <span className="text-sm text-muted-foreground">/ night</span>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <Button
            asChild
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
              Book on {platform}
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </article>
  )
}

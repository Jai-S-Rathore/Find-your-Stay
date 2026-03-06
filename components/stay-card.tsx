"use client"

import Image from "next/image"
import { Heart, Star } from "lucide-react"
import { useState } from "react"

interface StayCardProps {
  id: number
  image: string
  title: string
  location: string
  type: string
  price: number
  rating: number
  reviewCount: number
}

export function StayCard({
  image,
  title,
  location,
  type,
  price,
  rating,
  reviewCount,
}: StayCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <article className="group relative overflow-hidden rounded-xl bg-card transition-shadow hover:shadow-lg">
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
          <span className="rounded-full bg-card/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
            {type}
          </span>
        </div>
      </div>

      <div className="p-4">
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
          <span className="text-lg font-bold text-foreground">${price}</span>
          <span className="text-sm text-muted-foreground">/ night</span>
        </div>
      </div>
    </article>
  )
}

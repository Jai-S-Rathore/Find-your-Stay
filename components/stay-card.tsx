"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Heart } from "lucide-react"

// FIXED: Restored the full Stay interface so the UI doesn't break
export interface Stay {
  id: number
  title: string
  location: string
  type: string
  image: string
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

// FIXED: Restored component name to StayCard
export function StayCard({ stay }: { stay: Stay }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const DUMMY_USER_ID = 1; // We will replace this when auth is built

  // Fetch initial favorite status
  useEffect(() => {
    fetch(`http://localhost:5000/api/favorites/${DUMMY_USER_ID}`)
      .then(res => res.json())
      .then(data => {
        if (data.includes(stay.id)) {
          setIsFavorite(true);
        }
      })
      .catch(err => console.error("Failed to load favorites", err));
  }, [stay.id]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if the card is wrapped in a Link
    try {
      const res = await fetch("http://localhost:5000/api/favorites/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: DUMMY_USER_ID, stayId: stay.id })
      });
      const data = await res.json();
      setIsFavorite(data.isFavorite);
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    }
  }

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
    // Wrap the entire article in a Link component pointing to /stays/ID
    <Link href={`/stays/${stay.id}`} className="block h-full cursor-pointer">
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg">
      <div className="relative 'aspect-[4/3] overflow-hidden">
        <Image
          src={stay.image || "/images/default-stay.jpg"}
          alt={stay.title || "Stay image"}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* NEW HEART BUTTON */}
        <button 
          onClick={toggleFavorite}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
        >
          <Heart className={`h-4 w-4 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-foreground"}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold leading-tight text-foreground line-clamp-1">
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
          <span className="text-sm text-muted-foreground">/night</span>
        </div>
      </div>
    </article>
    </Link>
  )
}
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Star, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/AuthContext" // Imports your real auth!

export interface Stay {
  id: number
  title: string
  location: string
  rating: number
  image: string
  prices?: { platform: string; price: string | number; logo?: string }[]
}

export function StayCard({ stay }: { stay: Stay }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const { user } = useAuth() // Gets the logged-in user

  useEffect(() => {
    // Only check favorites if someone is actually logged in
    if (user?.id) {
      checkFavoriteStatus()
    } else {
      setIsFavorite(false)
    }
  }, [user?.id, stay.id])

  const checkFavoriteStatus = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/favorites/${user?.id}`)
      if (res.ok) {
        const favorites = await res.json()
        setIsFavorite(favorites.some((fav: any) => fav.stay_id === stay.id))
      }
    } catch (error) {
      console.error("Failed to check favorite status", error)
    }
  }

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents clicking the heart from opening the stay details page
    e.stopPropagation();
    
    if (!user) {
      alert("Please log in or sign up to save favorites!")
      return
    }

    try {
      const res = await fetch("http://localhost:5000/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, stayId: stay.id })
      })

      if (res.ok) {
        setIsFavorite(!isFavorite)
      }
    } catch (error) {
      console.error("Failed to toggle favorite", error)
    }
  }

  return (
    <Link href={`/stays/${stay.id}`} className="block h-full cursor-pointer">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:border-accent">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image 
            src={stay.image || "/images/default-stay.jpg"} 
            alt={stay.title} 
            fill 
            className="object-cover transition-transform duration-300 group-hover:scale-105" 
            unoptimized
          />
          
          <button 
            onClick={toggleFavorite}
            className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
          >
            <Heart className={`h-4 w-4 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-foreground"}`} />
          </button>
        </div>
        
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold line-clamp-1">{stay.title}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin size={12} /> {stay.location}
              </p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1 shrink-0 bg-red-50 text-red-600 hover:bg-red-100 border-0">
              <Star className="h-3 w-3 fill-current" />
              {stay.rating || "N/A"}
            </Badge>
          </div>

          <div className="mt-4 pt-4 border-t border-border mt-auto flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Starting from</span>
            <span className="font-bold text-lg">
              {stay.prices && stay.prices[0] ? `₹${stay.prices[0].price}` : "View Prices"}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
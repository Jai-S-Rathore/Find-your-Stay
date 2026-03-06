"use client"

import Image from "next/image"
import { Heart, Star, Phone, Mail, MessageCircle, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export type StayType = "Hotel" | "Hostel" | "Resort" | "Airbnb"

interface PlatformPrice {
  platform: string
  price: string
  logo: string
}

interface PlatformRating {
  platform: string
  rating: number
  reviewCount: number
}

interface HostContact {
  phone: string
  email: string
  whatsapp: string
}

export interface StayCardProps {
  id: number
  image: string
  title: string
  location: string
  type: StayType
  prices: PlatformPrice[]
  ratings: PlatformRating[]
  hostContact: HostContact
  onCall?: (stayId: number) => boolean
  callsRemaining: number
}

const typeColors: Record<StayType, string> = {
  Hotel: "bg-blue-500/10 text-blue-600 border-blue-200",
  Hostel: "bg-green-500/10 text-green-600 border-green-200",
  Resort: "bg-amber-500/10 text-amber-600 border-amber-200",
  Airbnb: "bg-rose-500/10 text-rose-600 border-rose-200",
}

const platformColors: Record<string, string> = {
  Google: "bg-blue-50 border-blue-200 text-blue-700",
  Airbnb: "bg-rose-50 border-rose-200 text-rose-700",
  MakeMyTrip: "bg-orange-50 border-orange-200 text-orange-700",
}

export function StayCard({
  id,
  image,
  title,
  location,
  type,
  prices,
  ratings,
  hostContact,
  onCall,
  callsRemaining,
}: StayCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [showPrices, setShowPrices] = useState(false)
  const [showContact, setShowContact] = useState(false)

  // Calculate aggregated rating
  const totalRating = ratings.reduce((acc, r) => acc + r.rating * r.reviewCount, 0)
  const totalReviews = ratings.reduce((acc, r) => acc + r.reviewCount, 0)
  const aggregatedRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : "0.0"

  // Find lowest price
  const lowestPrice = prices.reduce((min, p) => {
    const price = parseFloat(p.price.replace(/[^0-9.]/g, ""))
    const minPrice = parseFloat(min.price.replace(/[^0-9.]/g, ""))
    return price < minPrice ? p : min
  }, prices[0])

  const handleCall = () => {
    if (onCall && onCall(id)) {
      window.location.href = `tel:${hostContact.phone}`
    }
  }

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
          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-accent/10 px-2 py-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="text-sm font-bold text-foreground">{aggregatedRating}</span>
            <span className="text-xs text-muted-foreground">({totalReviews})</span>
          </div>
        </div>

        {/* Aggregated Rating Breakdown */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {ratings.map((r) => (
            <div
              key={r.platform}
              className="flex items-center gap-1 rounded-full bg-muted/50 px-2 py-0.5 text-xs"
            >
              <span className="font-medium text-muted-foreground">{r.platform}:</span>
              <Star className="h-3 w-3 fill-accent text-accent" />
              <span className="text-foreground">{r.rating}</span>
            </div>
          ))}
        </div>

        {/* Price Preview */}
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-sm text-muted-foreground">From</span>
          <span className="text-lg font-bold text-foreground">{lowestPrice.price}</span>
          <span className="text-sm text-muted-foreground">/ night on {lowestPrice.platform}</span>
        </div>

        {/* Price Comparison Toggle */}
        <button
          onClick={() => setShowPrices(!showPrices)}
          className="mt-3 flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          Compare prices
          {showPrices ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {/* Price Comparison Section */}
        {showPrices && (
          <div className="mt-3 space-y-2 rounded-lg border border-border bg-background p-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Price Comparison
            </p>
            {prices.map((p) => (
              <div
                key={p.platform}
                className={`flex items-center justify-between rounded-md border px-3 py-2 ${platformColors[p.platform] || "bg-muted/30 border-border"}`}
              >
                <span className="text-sm font-medium">{p.platform}</span>
                <span className="font-bold">{p.price}</span>
              </div>
            ))}
          </div>
        )}

        {/* Contact Host Section */}
        <div className="mt-4 border-t border-border pt-4">
          <button
            onClick={() => setShowContact(!showContact)}
            className="flex w-full items-center justify-between text-sm font-medium text-foreground"
          >
            <span>Contact Host</span>
            {showContact ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showContact && (
            <div className="mt-3 space-y-2">
              {/* Call Limit Indicator */}
              <div className="mb-3 flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                <span className="text-xs text-muted-foreground">Calls remaining</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-2 w-4 rounded-full ${
                        i <= callsRemaining ? "bg-green-500" : "bg-muted-foreground/30"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-xs font-medium text-foreground">{callsRemaining}/3</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCall}
                  disabled={callsRemaining === 0}
                  className="flex flex-col items-center gap-1 h-auto py-2"
                >
                  <Phone className="h-4 w-4" />
                  <span className="text-xs">Call</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex flex-col items-center gap-1 h-auto py-2"
                >
                  <a href={`mailto:${hostContact.email}`}>
                    <Mail className="h-4 w-4" />
                    <span className="text-xs">Email</span>
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex flex-col items-center gap-1 h-auto py-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                >
                  <a
                    href={`https://wa.me/${hostContact.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">WhatsApp</span>
                  </a>
                </Button>
              </div>

              {callsRemaining === 0 && (
                <p className="text-xs text-center text-destructive">
                  Call limit reached. Use Email or WhatsApp.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

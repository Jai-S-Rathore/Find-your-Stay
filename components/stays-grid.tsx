"use client"

import { useState } from "react"
import { StayCard, type StayType } from "@/components/stay-card"
import { Button } from "@/components/ui/button"

const stays = [
  {
    id: 1,
    image: "/images/stay-1.jpg",
    title: "Oceanfront Villa with Infinity Pool",
    location: "Malibu, California",
    type: "Resort" as StayType,
    priceRange: "$350–$450",
    rating: 4.9,
    reviewCount: 128,
    bookingUrl: "https://booking.com",
    platform: "Booking.com",
  },
  {
    id: 2,
    image: "/images/stay-2.jpg",
    title: "Cozy Mountain Cabin Retreat",
    location: "Aspen, Colorado",
    type: "Airbnb" as StayType,
    priceRange: "$180–$280",
    rating: 4.8,
    reviewCount: 94,
    bookingUrl: "https://airbnb.com",
    platform: "Airbnb",
  },
  {
    id: 3,
    image: "/images/stay-3.jpg",
    title: "Modern City Penthouse Suite",
    location: "New York City, NY",
    type: "Hotel" as StayType,
    priceRange: "$420–$520",
    rating: 4.7,
    reviewCount: 156,
    bookingUrl: "https://hotels.com",
    platform: "Hotels.com",
  },
  {
    id: 4,
    image: "/images/stay-4.jpg",
    title: "Charming Countryside Cottage",
    location: "Cotswolds, England",
    type: "Airbnb" as StayType,
    priceRange: "$120–$185",
    rating: 4.9,
    reviewCount: 72,
    bookingUrl: "https://airbnb.com",
    platform: "Airbnb",
  },
  {
    id: 5,
    image: "/images/stay-5.jpg",
    title: "Overwater Bungalow Paradise",
    location: "Maldives",
    type: "Resort" as StayType,
    priceRange: "$700–$890",
    rating: 5.0,
    reviewCount: 203,
    bookingUrl: "https://expedia.com",
    platform: "Expedia",
  },
  {
    id: 6,
    image: "/images/stay-6.jpg",
    title: "Budget-Friendly City Hostel",
    location: "Barcelona, Spain",
    type: "Hostel" as StayType,
    priceRange: "$25–$45",
    rating: 4.5,
    reviewCount: 312,
    bookingUrl: "https://hostelworld.com",
    platform: "Hostelworld",
  },
  {
    id: 7,
    image: "/images/stay-1.jpg",
    title: "Luxury Beach Resort & Spa",
    location: "Cancun, Mexico",
    type: "Resort" as StayType,
    priceRange: "$280–$400",
    rating: 4.8,
    reviewCount: 245,
    bookingUrl: "https://booking.com",
    platform: "Booking.com",
  },
  {
    id: 8,
    image: "/images/stay-3.jpg",
    title: "Downtown Boutique Hotel",
    location: "Tokyo, Japan",
    type: "Hotel" as StayType,
    priceRange: "$150–$220",
    rating: 4.6,
    reviewCount: 189,
    bookingUrl: "https://hotels.com",
    platform: "Hotels.com",
  },
]

const filters: StayType[] = ["Hotel", "Hostel", "Resort", "Airbnb"]

export function StaysGrid() {
  const [activeFilter, setActiveFilter] = useState<StayType | "All">("All")

  const filteredStays =
    activeFilter === "All"
      ? stays
      : stays.filter((stay) => stay.type === activeFilter)

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Explore Accommodations
            </h2>
            <p className="mt-2 text-muted-foreground">
              Find hotels, hostels, resorts, and Airbnb stays
            </p>
          </div>
          <button className="text-sm font-medium text-accent hover:underline">
            View all properties
          </button>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <Button
            variant={activeFilter === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("All")}
            className="rounded-full"
          >
            All
          </Button>
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className="rounded-full"
            >
              {filter}
            </Button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredStays.map((stay) => (
            <StayCard key={stay.id} {...stay} />
          ))}
        </div>

        {filteredStays.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">No stays found for this filter.</p>
          </div>
        )}
      </div>
    </section>
  )
}

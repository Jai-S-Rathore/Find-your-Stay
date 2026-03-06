"use client"

import { useState } from "react"
import { StayCard, type StayType, type StayCardProps } from "@/components/stay-card"
import { Button } from "@/components/ui/button"

const stays: Omit<StayCardProps, "onCall" | "callsRemaining">[] = [
  {
    id: 1,
    image: "/images/stay-1.jpg",
    title: "Oceanfront Villa with Infinity Pool",
    location: "Malibu, California",
    type: "Resort" as StayType,
    prices: [
      { platform: "Google", price: "$380", logo: "" },
      { platform: "Airbnb", price: "$420", logo: "" },
      { platform: "MakeMyTrip", price: "$395", logo: "" },
    ],
    ratings: [
      { platform: "Google", rating: 4.8, reviewCount: 156 },
      { platform: "Airbnb", rating: 4.9, reviewCount: 89 },
      { platform: "MakeMyTrip", rating: 4.7, reviewCount: 45 },
    ],
    hostContact: {
      phone: "+1-310-555-0123",
      email: "oceanvilla@stays.com",
      whatsapp: "+13105550123",
    },
  },
  {
    id: 2,
    image: "/images/stay-2.jpg",
    title: "Cozy Mountain Cabin Retreat",
    location: "Aspen, Colorado",
    type: "Airbnb" as StayType,
    prices: [
      { platform: "Google", price: "$220", logo: "" },
      { platform: "Airbnb", price: "$195", logo: "" },
      { platform: "MakeMyTrip", price: "$245", logo: "" },
    ],
    ratings: [
      { platform: "Google", rating: 4.7, reviewCount: 78 },
      { platform: "Airbnb", rating: 4.9, reviewCount: 124 },
      { platform: "MakeMyTrip", rating: 4.6, reviewCount: 32 },
    ],
    hostContact: {
      phone: "+1-970-555-0456",
      email: "mountaincabin@stays.com",
      whatsapp: "+19705550456",
    },
  },
  {
    id: 3,
    image: "/images/stay-3.jpg",
    title: "Modern City Penthouse Suite",
    location: "New York City, NY",
    type: "Hotel" as StayType,
    prices: [
      { platform: "Google", price: "$450", logo: "" },
      { platform: "Airbnb", price: "$520", logo: "" },
      { platform: "MakeMyTrip", price: "$485", logo: "" },
    ],
    ratings: [
      { platform: "Google", rating: 4.6, reviewCount: 234 },
      { platform: "Airbnb", rating: 4.5, reviewCount: 67 },
      { platform: "MakeMyTrip", rating: 4.8, reviewCount: 89 },
    ],
    hostContact: {
      phone: "+1-212-555-0789",
      email: "penthouse@stays.com",
      whatsapp: "+12125550789",
    },
  },
  {
    id: 4,
    image: "/images/stay-4.jpg",
    title: "Charming Countryside Cottage",
    location: "Cotswolds, England",
    type: "Airbnb" as StayType,
    prices: [
      { platform: "Google", price: "$145", logo: "" },
      { platform: "Airbnb", price: "$125", logo: "" },
      { platform: "MakeMyTrip", price: "$160", logo: "" },
    ],
    ratings: [
      { platform: "Google", rating: 4.9, reviewCount: 56 },
      { platform: "Airbnb", rating: 4.9, reviewCount: 98 },
      { platform: "MakeMyTrip", rating: 4.8, reviewCount: 23 },
    ],
    hostContact: {
      phone: "+44-1234-567890",
      email: "cottage@stays.com",
      whatsapp: "+441234567890",
    },
  },
  {
    id: 5,
    image: "/images/stay-5.jpg",
    title: "Overwater Bungalow Paradise",
    location: "Maldives",
    type: "Resort" as StayType,
    prices: [
      { platform: "Google", price: "$750", logo: "" },
      { platform: "Airbnb", price: "$890", logo: "" },
      { platform: "MakeMyTrip", price: "$720", logo: "" },
    ],
    ratings: [
      { platform: "Google", rating: 5.0, reviewCount: 189 },
      { platform: "Airbnb", rating: 4.9, reviewCount: 45 },
      { platform: "MakeMyTrip", rating: 5.0, reviewCount: 134 },
    ],
    hostContact: {
      phone: "+960-555-1234",
      email: "paradise@stays.com",
      whatsapp: "+9605551234",
    },
  },
  {
    id: 6,
    image: "/images/stay-6.jpg",
    title: "Budget-Friendly City Hostel",
    location: "Barcelona, Spain",
    type: "Hostel" as StayType,
    prices: [
      { platform: "Google", price: "$28", logo: "" },
      { platform: "Airbnb", price: "$35", logo: "" },
      { platform: "MakeMyTrip", price: "$32", logo: "" },
    ],
    ratings: [
      { platform: "Google", rating: 4.4, reviewCount: 412 },
      { platform: "Airbnb", rating: 4.3, reviewCount: 156 },
      { platform: "MakeMyTrip", rating: 4.5, reviewCount: 89 },
    ],
    hostContact: {
      phone: "+34-93-555-6789",
      email: "hostel@stays.com",
      whatsapp: "+34935556789",
    },
  },
  {
    id: 7,
    image: "/images/stay-1.jpg",
    title: "Luxury Beach Resort & Spa",
    location: "Cancun, Mexico",
    type: "Resort" as StayType,
    prices: [
      { platform: "Google", price: "$310", logo: "" },
      { platform: "Airbnb", price: "$380", logo: "" },
      { platform: "MakeMyTrip", price: "$295", logo: "" },
    ],
    ratings: [
      { platform: "Google", rating: 4.8, reviewCount: 278 },
      { platform: "Airbnb", rating: 4.7, reviewCount: 89 },
      { platform: "MakeMyTrip", rating: 4.9, reviewCount: 156 },
    ],
    hostContact: {
      phone: "+52-998-555-4321",
      email: "luxurybeach@stays.com",
      whatsapp: "+529985554321",
    },
  },
  {
    id: 8,
    image: "/images/stay-3.jpg",
    title: "Downtown Boutique Hotel",
    location: "Tokyo, Japan",
    type: "Hotel" as StayType,
    prices: [
      { platform: "Google", price: "$175", logo: "" },
      { platform: "Airbnb", price: "$210", logo: "" },
      { platform: "MakeMyTrip", price: "$165", logo: "" },
    ],
    ratings: [
      { platform: "Google", rating: 4.7, reviewCount: 167 },
      { platform: "Airbnb", rating: 4.6, reviewCount: 78 },
      { platform: "MakeMyTrip", rating: 4.8, reviewCount: 112 },
    ],
    hostContact: {
      phone: "+81-3-5555-6789",
      email: "boutique@stays.com",
      whatsapp: "+81355556789",
    },
  },
]

const filters: StayType[] = ["Hotel", "Hostel", "Resort", "Airbnb"]

export function StaysGrid() {
  const [activeFilter, setActiveFilter] = useState<StayType | "All">("All")
  const [callsRemaining, setCallsRemaining] = useState(3)

  const handleCall = (stayId: number): boolean => {
    if (callsRemaining > 0) {
      setCallsRemaining((prev) => prev - 1)
      return true
    }
    return false
  }

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
              Compare & Discover Stays
            </h2>
            <p className="mt-2 text-muted-foreground">
              Find the best prices across Google, Airbnb, and MakeMyTrip
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5">
              <span className="text-sm text-muted-foreground">Calls today:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-2 w-4 rounded-full ${
                      i <= callsRemaining ? "bg-green-500" : "bg-muted-foreground/30"
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm font-medium text-foreground">{callsRemaining}/3</span>
              </div>
            </div>
          </div>
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
            <StayCard
              key={stay.id}
              {...stay}
              onCall={handleCall}
              callsRemaining={callsRemaining}
            />
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

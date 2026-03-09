"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { StayCard, type Stay } from "@/components/stay-card"

const filters = ["Hotel", "Hostel", "Resort", "Airbnb"] as const
type StayType = (typeof filters)[number]

export function StaysGrid({ stays }: { stays: Stay[] }) {
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
              Compare & Discover Stays
            </h2>
            <p className="mt-2 text-muted-foreground">
              Find the best prices across your favorite platforms
            </p>
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
            <StayCard key={stay.id} stay={stay} />
          ))}
        </div>

        {filteredStays.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">
              No stays found for this filter.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
"use client"

import { useState } from "react"
import { Search, MapPin, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SearchBar() {
  const [city, setCity] = useState("")

  return (
    <section className="relative bg-card py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Find Your Perfect Stay
          </h1>
          <p className="mt-4 text-pretty text-lg text-muted-foreground md:text-xl">
            Hotels, hostels, resorts, and Airbnb stays — all in one place.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-4 shadow-lg md:flex-row md:items-center md:gap-0 md:p-2">
            <div className="flex flex-1 items-center gap-3 px-4 py-2">
              <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <label htmlFor="city" className="sr-only">
                  Where to?
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="Where to?"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>

            <div className="hidden h-10 w-px bg-border md:block" />

            <div className="flex flex-1 items-center gap-3 border-t border-border px-4 py-2 md:border-t-0">
              <Calendar className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Check in - Check out</p>
                <p className="text-sm font-medium text-foreground">Add dates</p>
              </div>
            </div>

            <div className="hidden h-10 w-px bg-border md:block" />

            <div className="flex flex-1 items-center gap-3 border-t border-border px-4 py-2 md:border-t-0">
              <Users className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Guests</p>
                <p className="text-sm font-medium text-foreground">Add guests</p>
              </div>
            </div>

            <Button
              size="lg"
              className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90 md:ml-2 md:mt-0 md:rounded-xl"
            >
              <Search className="mr-2 h-5 w-5" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

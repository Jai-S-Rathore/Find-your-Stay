"use client"

import { MapPin, ZoomIn, ZoomOut, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"

const markers = [
  { id: 1, x: 15, y: 35, label: "Malibu", price: "$450" },
  { id: 2, x: 45, y: 25, label: "Aspen", price: "$280" },
  { id: 3, x: 75, y: 30, label: "NYC", price: "$520" },
  { id: 4, x: 55, y: 60, label: "Cotswolds", price: "$185" },
  { id: 5, x: 25, y: 70, label: "Maldives", price: "$890" },
  { id: 6, x: 85, y: 55, label: "Scottsdale", price: "$340" },
]

export function MapSection() {
  return (
    <section className="bg-secondary py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            Explore on the map
          </h2>
          <p className="mt-2 text-muted-foreground">
            Find accommodations in your desired location
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          <div className="relative aspect-[16/9] bg-muted">
            {/* Map placeholder with grid pattern */}
            <div className="absolute inset-0 opacity-30">
              <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-muted-foreground"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Decorative map elements */}
            <div className="absolute inset-0">
              <div className="absolute left-[10%] top-[20%] h-32 w-48 rounded-full bg-accent/10" />
              <div className="absolute right-[15%] top-[40%] h-24 w-36 rounded-full bg-accent/10" />
              <div className="absolute bottom-[25%] left-[30%] h-40 w-56 rounded-full bg-accent/10" />
            </div>

            {/* Map markers */}
            {markers.map((marker) => (
              <button
                key={marker.id}
                className="group absolute -translate-x-1/2 -translate-y-full transform transition-transform hover:scale-110"
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
              >
                <div className="flex flex-col items-center">
                  <div className="rounded-lg bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground shadow-md">
                    {marker.price}
                  </div>
                  <MapPin className="h-6 w-6 text-accent drop-shadow-md" />
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-card px-2 py-1 text-xs font-medium text-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                  {marker.label}
                </div>
              </button>
            ))}

            {/* Map overlay text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-xl bg-card/90 px-6 py-4 text-center backdrop-blur">
                <MapPin className="mx-auto mb-2 h-8 w-8 text-accent" />
                <p className="font-medium text-foreground">Interactive Map</p>
                <p className="text-sm text-muted-foreground">
                  Click markers to view properties
                </p>
              </div>
            </div>
          </div>

          {/* Map controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-lg shadow-md"
            >
              <ZoomIn className="h-5 w-5" />
              <span className="sr-only">Zoom in</span>
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-lg shadow-md"
            >
              <ZoomOut className="h-5 w-5" />
              <span className="sr-only">Zoom out</span>
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-lg shadow-md"
            >
              <Layers className="h-5 w-5" />
              <span className="sr-only">Change map style</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState } from "react"
import { MapPin, ZoomIn, ZoomOut, Layers, Hotel, Home, Building, Tent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type StayType = "Hotel" | "Hostel" | "Resort" | "Airbnb"

interface MapMarker {
  id: number
  x: number
  y: number
  label: string
  price: string
  type: StayType
}

const markers: MapMarker[] = [
  { id: 1, x: 15, y: 35, label: "Malibu Resort", price: "$350–$450", type: "Resort" },
  { id: 2, x: 45, y: 25, label: "Aspen Cabin", price: "$180–$280", type: "Airbnb" },
  { id: 3, x: 75, y: 30, label: "NYC Hotel", price: "$420–$520", type: "Hotel" },
  { id: 4, x: 55, y: 60, label: "Cotswolds Cottage", price: "$120–$185", type: "Airbnb" },
  { id: 5, x: 25, y: 70, label: "Maldives Resort", price: "$700–$890", type: "Resort" },
  { id: 6, x: 85, y: 55, label: "Barcelona Hostel", price: "$25–$45", type: "Hostel" },
]

const typeIcons: Record<StayType, React.ReactNode> = {
  Hotel: <Hotel className="h-3 w-3" />,
  Hostel: <Tent className="h-3 w-3" />,
  Resort: <Building className="h-3 w-3" />,
  Airbnb: <Home className="h-3 w-3" />,
}

const typeColors: Record<StayType, string> = {
  Hotel: "bg-blue-500 text-white",
  Hostel: "bg-green-500 text-white",
  Resort: "bg-amber-500 text-white",
  Airbnb: "bg-rose-500 text-white",
}

export function MapSection() {
  const [activeMarker, setActiveMarker] = useState<number | null>(null)
  const [filterType, setFilterType] = useState<StayType | "All">("All")

  const filteredMarkers = filterType === "All" 
    ? markers 
    : markers.filter(m => m.type === filterType)

  return (
    <section className="bg-secondary py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            Explore on the Map
          </h2>
          <p className="mt-2 text-muted-foreground">
            Find accommodations in your desired location
          </p>
        </div>

        <div className="mx-auto mb-6 flex max-w-5xl flex-wrap justify-center gap-2">
          <Button
            variant={filterType === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("All")}
            className="rounded-full"
          >
            All Types
          </Button>
          {(["Hotel", "Hostel", "Resort", "Airbnb"] as StayType[]).map((type) => (
            <Button
              key={type}
              variant={filterType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType(type)}
              className="rounded-full"
            >
              {typeIcons[type]}
              <span className="ml-1">{type}</span>
            </Button>
          ))}
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
            {filteredMarkers.map((marker) => (
              <button
                key={marker.id}
                className="group absolute -translate-x-1/2 -translate-y-full transform transition-all hover:scale-110 hover:z-10"
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                onClick={() => setActiveMarker(activeMarker === marker.id ? null : marker.id)}
              >
                <div className="flex flex-col items-center">
                  <div className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold shadow-md ${typeColors[marker.type]}`}>
                    {typeIcons[marker.type]}
                    <span>{marker.price}</span>
                  </div>
                  <MapPin className="h-6 w-6 text-foreground drop-shadow-md" />
                </div>
                {activeMarker === marker.id && (
                  <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 transform whitespace-nowrap rounded-lg bg-card p-3 shadow-lg border border-border z-20">
                    <p className="font-semibold text-foreground text-sm">{marker.label}</p>
                    <Badge variant="outline" className="mt-1 text-xs">{marker.type}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">{marker.price}/night</p>
                  </div>
                )}
              </button>
            ))}

            {/* Map overlay text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="rounded-xl bg-card/90 px-6 py-4 text-center backdrop-blur">
                <MapPin className="mx-auto mb-2 h-8 w-8 text-accent" />
                <p className="font-medium text-foreground">Interactive Map</p>
                <p className="text-sm text-muted-foreground">
                  Click markers to view property details
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

          {/* Legend */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-1 rounded-lg bg-card/90 p-3 backdrop-blur border border-border">
            <p className="text-xs font-medium text-foreground mb-1">Legend</p>
            {(["Hotel", "Hostel", "Resort", "Airbnb"] as StayType[]).map((type) => (
              <div key={type} className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className={`h-3 w-3 rounded ${typeColors[type]}`} />
                <span>{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

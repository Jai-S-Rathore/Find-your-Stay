import { StayCard } from "@/components/stay-card"

const stays = [
  {
    id: 1,
    image: "/images/stay-1.jpg",
    title: "Oceanfront Villa with Infinity Pool",
    location: "Malibu, California",
    type: "Entire villa",
    price: 450,
    rating: 4.9,
    reviewCount: 128,
  },
  {
    id: 2,
    image: "/images/stay-2.jpg",
    title: "Cozy Mountain Cabin Retreat",
    location: "Aspen, Colorado",
    type: "Entire cabin",
    price: 280,
    rating: 4.8,
    reviewCount: 94,
  },
  {
    id: 3,
    image: "/images/stay-3.jpg",
    title: "Modern City Penthouse",
    location: "New York City, NY",
    type: "Entire apartment",
    price: 520,
    rating: 4.7,
    reviewCount: 156,
  },
  {
    id: 4,
    image: "/images/stay-4.jpg",
    title: "Charming Countryside Cottage",
    location: "Cotswolds, England",
    type: "Entire cottage",
    price: 185,
    rating: 4.9,
    reviewCount: 72,
  },
  {
    id: 5,
    image: "/images/stay-5.jpg",
    title: "Overwater Bungalow Paradise",
    location: "Maldives",
    type: "Entire bungalow",
    price: 890,
    rating: 5.0,
    reviewCount: 203,
  },
  {
    id: 6,
    image: "/images/stay-6.jpg",
    title: "Desert Oasis Villa",
    location: "Scottsdale, Arizona",
    type: "Entire villa",
    price: 340,
    rating: 4.8,
    reviewCount: 89,
  },
]

export function StaysGrid() {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Popular destinations
            </h2>
            <p className="mt-2 text-muted-foreground">
              Hand-picked stays loved by travelers
            </p>
          </div>
          <button className="text-sm font-medium text-accent hover:underline">
            View all properties
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stays.map((stay) => (
            <StayCard key={stay.id} {...stay} />
          ))}
        </div>
      </div>
    </section>
  )
}

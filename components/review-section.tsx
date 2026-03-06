"use client"

import { useState } from "react"
import { Star, Quote, Send, Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Review {
  id: number
  name: string
  avatar: string
  location: string
  rating: number
  comment: string
  property: string
  stayType: string
  date: string
  verified: boolean
}

const stayOptions = [
  { name: "Oceanfront Villa with Infinity Pool", type: "Resort" },
  { name: "Cozy Mountain Cabin Retreat", type: "Airbnb" },
  { name: "Modern City Penthouse Suite", type: "Hotel" },
  { name: "Charming Countryside Cottage", type: "Airbnb" },
  { name: "Overwater Bungalow Paradise", type: "Resort" },
  { name: "Budget-Friendly City Hostel", type: "Hostel" },
  { name: "Luxury Beach Resort & Spa", type: "Resort" },
  { name: "Downtown Boutique Hotel", type: "Hotel" },
]

const initialReviews: Review[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    avatar: "SM",
    location: "San Francisco, CA",
    rating: 5,
    comment:
      "Absolutely stunning property! The photos don't do it justice. The host was incredibly responsive and the amenities were top-notch. Will definitely book again.",
    property: "Oceanfront Villa with Infinity Pool",
    stayType: "Resort",
    date: "February 2026",
    verified: true,
  },
  {
    id: 2,
    name: "James Chen",
    avatar: "JC",
    location: "Toronto, Canada",
    rating: 5,
    comment:
      "Perfect mountain getaway. The cabin was spotless, the views were breathtaking, and the hot tub was the cherry on top. Highly recommend for couples!",
    property: "Cozy Mountain Cabin Retreat",
    stayType: "Airbnb",
    date: "January 2026",
    verified: true,
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    avatar: "ER",
    location: "London, UK",
    rating: 5,
    comment:
      "The countryside cottage exceeded all expectations. So peaceful and charming. The garden was beautiful and the village nearby had great restaurants.",
    property: "Charming Countryside Cottage",
    stayType: "Airbnb",
    date: "February 2026",
    verified: true,
  },
  {
    id: 4,
    name: "Rahul Sharma",
    avatar: "RS",
    location: "Mumbai, India",
    rating: 4,
    comment:
      "Great value for money at this hostel. Met some amazing travelers and the staff organized fun events. Only downside was noise at night.",
    property: "Budget-Friendly City Hostel",
    stayType: "Hostel",
    date: "January 2026",
    verified: true,
  },
  {
    id: 5,
    name: "Maria Santos",
    avatar: "MS",
    location: "Sao Paulo, Brazil",
    rating: 5,
    comment:
      "A once in a lifetime experience! Waking up over the crystal clear water was magical. The resort staff made us feel like royalty.",
    property: "Overwater Bungalow Paradise",
    stayType: "Resort",
    date: "December 2025",
    verified: true,
  },
  {
    id: 6,
    name: "David Kim",
    avatar: "DK",
    location: "Seoul, South Korea",
    rating: 4,
    comment:
      "The penthouse had incredible views of the city. Location was perfect for exploring NYC. A bit pricey but worth it for special occasions.",
    property: "Modern City Penthouse Suite",
    stayType: "Hotel",
    date: "February 2026",
    verified: true,
  },
]

export function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [showForm, setShowForm] = useState(false)
  const [filterProperty, setFilterProperty] = useState<string>("All")
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [selectedStay, setSelectedStay] = useState("")
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !comment.trim() || !selectedStay) return

    const stayInfo = stayOptions.find((s) => s.name === selectedStay)

    const newReview: Review = {
      id: Date.now(),
      name: name.trim(),
      avatar: name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      location: location.trim() || "Unknown location",
      rating,
      comment: comment.trim(),
      property: selectedStay,
      stayType: stayInfo?.type || "Hotel",
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      verified: false,
    }

    setReviews([newReview, ...reviews])
    setName("")
    setLocation("")
    setSelectedStay("")
    setComment("")
    setRating(5)
    setShowForm(false)
  }

  const filteredReviews =
    filterProperty === "All"
      ? reviews
      : reviews.filter((r) => r.property === filterProperty)

  const uniqueProperties = ["All", ...new Set(reviews.map((r) => r.property))]

  return (
    <section className="bg-card py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Guest Reviews
            </h2>
            <p className="mt-2 text-muted-foreground">
              Real experiences from verified travelers
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {/* Property Filter */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                {filterProperty === "All" ? "All Properties" : filterProperty.slice(0, 20) + "..."}
                <ChevronDown className="h-4 w-4" />
              </Button>
              {showFilterDropdown && (
                <div className="absolute right-0 top-full z-10 mt-2 max-h-64 w-72 overflow-auto rounded-lg border border-border bg-card shadow-lg">
                  {uniqueProperties.map((property) => (
                    <button
                      key={property}
                      onClick={() => {
                        setFilterProperty(property)
                        setShowFilterDropdown(false)
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm hover:bg-muted ${
                        filterProperty === property ? "bg-muted font-medium" : ""
                      }`}
                    >
                      {property}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {showForm ? "Cancel" : "Write a Review"}
            </Button>
          </div>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mb-12 max-w-2xl rounded-xl border border-border bg-background p-6"
          >
            <h3 className="mb-6 text-lg font-semibold text-foreground">
              Share Your Experience
            </h3>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-foreground">
                Your Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? "fill-accent text-accent"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Your Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Your Location
                </label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="stay"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Select Stay
              </label>
              <select
                id="stay"
                value={selectedStay}
                onChange={(e) => setSelectedStay(e.target.value)}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">Choose the property you stayed at</option>
                {stayOptions.map((stay) => (
                  <option key={stay.name} value={stay.name}>
                    {stay.name} ({stay.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label
                htmlFor="comment"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Your Review
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your experience..."
                rows={4}
                required
              />
            </div>

            <Button
              type="submit"
              className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Submit Review
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
        )}

        {/* Review Stats */}
        <div className="mb-8 flex flex-wrap items-center gap-6 rounded-xl border border-border bg-background p-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg bg-accent/10 px-3 py-1.5">
              <Star className="h-5 w-5 fill-accent text-accent" />
              <span className="text-lg font-bold text-foreground">
                {(filteredReviews.reduce((acc, r) => acc + r.rating, 0) / filteredReviews.length || 0).toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">Average rating</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{filteredReviews.length}</span> reviews
            {filterProperty !== "All" && (
              <span> for {filterProperty}</span>
            )}
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredReviews.map((review) => (
            <article
              key={review.id}
              className="relative rounded-xl border border-border bg-background p-6 transition-shadow hover:shadow-md"
            >
              <Quote className="absolute right-6 top-6 h-8 w-8 text-muted/50" />

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                  {review.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{review.name}</h3>
                    {review.verified && (
                      <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{review.location}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "fill-accent text-accent"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>

              <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground">
                {review.comment}
              </p>

              <div className="mt-4 border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Stayed at{" "}
                      <span className="font-medium text-foreground">
                        {review.property}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    review.stayType === "Hotel" ? "bg-blue-100 text-blue-700" :
                    review.stayType === "Hostel" ? "bg-green-100 text-green-700" :
                    review.stayType === "Resort" ? "bg-amber-100 text-amber-700" :
                    "bg-rose-100 text-rose-700"
                  }`}>
                    {review.stayType}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">No reviews yet for this property. Be the first to write one!</p>
          </div>
        )}

        <div className="mt-10 text-center">
          <button className="text-sm font-medium text-accent hover:underline">
            Load more reviews
          </button>
        </div>
      </div>
    </section>
  )
}

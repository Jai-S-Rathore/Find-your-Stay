"use client"

import { useState } from "react"
import { Star, Quote, Send } from "lucide-react"
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
  date: string
}

const initialReviews: Review[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    avatar: "SM",
    location: "San Francisco, CA",
    rating: 5,
    comment:
      "Absolutely stunning property! The photos don't do it justice. The host was incredibly responsive and the amenities were top-notch. Will definitely book again.",
    property: "Oceanfront Villa",
    date: "February 2026",
  },
  {
    id: 2,
    name: "James Chen",
    avatar: "JC",
    location: "Toronto, Canada",
    rating: 5,
    comment:
      "Perfect mountain getaway. The cabin was spotless, the views were breathtaking, and the hot tub was the cherry on top. Highly recommend for couples!",
    property: "Mountain Cabin",
    date: "January 2026",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    avatar: "ER",
    location: "London, UK",
    rating: 5,
    comment:
      "The countryside cottage exceeded all expectations. So peaceful and charming. The garden was beautiful and the village nearby had great restaurants.",
    property: "Countryside Cottage",
    date: "February 2026",
  },
]

export function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [property, setProperty] = useState("")
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !comment.trim() || !property.trim()) return

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
      property: property.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    }

    setReviews([newReview, ...reviews])
    setName("")
    setLocation("")
    setProperty("")
    setComment("")
    setRating(5)
    setShowForm(false)
  }

  return (
    <section className="bg-card py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              What Our Guests Say
            </h2>
            <p className="mt-2 text-muted-foreground">
              Real experiences from verified travelers
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {showForm ? "Cancel" : "Write a Review"}
          </Button>
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
                htmlFor="property"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Property Stayed At
              </label>
              <Input
                id="property"
                value={property}
                onChange={(e) => setProperty(e.target.value)}
                placeholder="e.g., Oceanfront Villa"
                required
              />
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

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {reviews.map((review) => (
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
                  <h3 className="font-semibold text-foreground">{review.name}</h3>
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
                <p className="text-xs text-muted-foreground">
                  Stayed at{" "}
                  <span className="font-medium text-foreground">
                    {review.property}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">{review.date}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button className="text-sm font-medium text-accent hover:underline">
            Read more reviews
          </button>
        </div>
      </div>
    </section>
  )
}

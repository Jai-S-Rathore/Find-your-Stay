import { Star, Quote } from "lucide-react"

const reviews = [
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
  return (
    <section className="bg-card py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            What our guests say
          </h2>
          <p className="mt-2 text-muted-foreground">
            Real experiences from verified travelers
          </p>
        </div>

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
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-accent text-accent"
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

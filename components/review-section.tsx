"use client"

import { useState, useEffect } from "react"
import { Star, Quote, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Review {
  id: number
  rating: number
  comment: string
  created_at: string
  user_name: string
  property_name: string
  stay_type: string
}

interface StayOption {
  id: number
  title: string
  type: string
}

export function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stayOptions, setStayOptions] = useState<StayOption[]>([])
  const [loading, setLoading] = useState(true)

  // Form State
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("")
  const [newComment, setNewComment] = useState("")
  const [newRating, setNewRating] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const DUMMY_USER_ID = 1; // Replace when you build the login system

  // Fetch Reviews and Stays on load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [reviewsRes, staysRes] = await Promise.all([
          fetch("http://localhost:5000/api/reviews"),
          fetch("http://localhost:5000/api/stays") // Reusing your existing stays endpoint
        ])
        
        if (reviewsRes.ok) setReviews(await reviewsRes.json())
        if (staysRes.ok) setStayOptions(await staysRes.json())
      } catch (error) {
        console.error("Failed to load review section data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchInitialData()
  }, [])

  // Handle form submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPropertyId || !newComment.trim()) return

    setIsSubmitting(true)
    try {
      const res = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stayId: selectedPropertyId,
          userId: DUMMY_USER_ID,
          rating: newRating,
          comment: newComment
        })
      })

      if (res.ok) {
        // Refresh reviews after successful post
        const refreshed = await fetch("http://localhost:5000/api/reviews")
        setReviews(await refreshed.json())
        setNewComment("") // Clear form
        setNewRating(5)
      }
    } catch (error) {
      console.error("Failed to post review", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper to format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Guest Experiences</h2>
          <p className="mt-4 text-lg text-muted-foreground">Read what our community has to say about their stays.</p>
        </div>

        <div className="mx-auto mb-16 max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-semibold text-foreground">Write a Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            
            <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
              <SelectTrigger>
                <SelectValue placeholder="Which property did you stay at?" />
              </SelectTrigger>
              <SelectContent>
                {stayOptions.map((stay) => (
                  <SelectItem key={stay.id} value={stay.id.toString()}>
                    {stay.title} ({stay.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Rating:</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${star <= newRating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              placeholder="Tell us about your experience..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || !selectedPropertyId || !newComment.trim()}>
                {isSubmitting ? "Posting..." : "Post Review"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading reviews...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <article key={review.id} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                      {review.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{review.user_name}</h4>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                    ))}
                  </div>
                </div>
                <div className="mb-4 flex-1">
                  <Quote className="mb-2 h-6 w-6 text-muted-foreground/20" />
                  <p className="text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Stayed at <span className="font-medium text-foreground">{review.property_name || "Unknown"}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDate(review.created_at)}</p>
                    </div>
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                      {review.stay_type}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        
        {!loading && reviews.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            No reviews yet. Be the first to write one!
          </div>
        )}
      </div>
    </section>
  )
}
"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/AuthContext"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { StayCard, type Stay } from "@/components/stay-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function FavoritesPage() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<Stay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`http://localhost:5000/api/favorites/${user.id}/details`)
        if (res.ok) {
          const data = await res.json()
          setFavorites(data)
        }
      } catch (error) {
        console.error("Failed to load favorites", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [user])

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Saved Properties</h1>
          <p className="text-muted-foreground mb-6">Please log in to view your favorite stays.</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="container mx-auto flex-1 px-4 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">My Favorites</h1>
        <p className="text-muted-foreground mb-10">Stays you have saved for later.</p>

        {loading ? (
          <div className="text-center p-10 font-medium text-lg">Loading your favorites...</div>
        ) : favorites.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((stay) => (
              <StayCard key={stay.id} stay={stay} />
            ))}
          </div>
        ) : (
          <div className="text-center p-20 border border-dashed border-border rounded-2xl bg-muted/30">
            <h3 className="text-xl font-bold mb-2">No favorites yet!</h3>
            <p className="text-muted-foreground mb-6">Start exploring and click the heart icon to save properties here.</p>
            <Button asChild>
              <Link href="/">Explore Stays</Link>
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
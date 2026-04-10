"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Star, MapPin, Phone, Mail, MessageCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function StayDetailsPage() {
  const params = useParams()
  const id = params?.id
  const [stay, setStay] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/stays/${id}`)
        if (!response.ok) throw new Error("Stay not found")
        const data = await response.json()
        setStay(data)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [id])

  if (loading) return <div className="flex h-screen items-center justify-center font-bold">Loading Stay Details...</div>
  if (!stay) return <div className="flex h-screen items-center justify-center">Property not found. Check if Backend is running.</div>

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-1">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground">
          <ArrowLeft size={16} /> Back to Search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Media Section */}
          <div className="space-y-6">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-border">
              {/* Note: mapped image_url from DB to stay.image in controller */}
              <Image 
                src={stay.image || "/images/default-stay.jpg"} 
                alt={stay.title} 
                fill 
                className="object-cover" 
              />
            </div>
            
            <div className="p-6 bg-card rounded-2xl border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-3">About this {stay.type}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {stay.address || "No detailed description provided for this property yet."}
              </p>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight">{stay.title}</h1>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <MapPin size={18} className="text-accent" />
                  <span>{stay.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-accent/10 px-3 py-2 rounded-xl border border-accent/20">
                <Star className="h-5 w-5 fill-accent text-accent" />
                <span className="text-xl font-bold">{stay.overall_rating || "N/A"}</span>
              </div>
            </div>

            {/* Price Comparison - Matches your stay_prices table */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                Live Prices
              </h2>
              <div className="space-y-4">
                {stay.prices && stay.prices.length > 0 ? (
                  stay.prices?.map((p: any, index: number) => (
                    <div key={`${p.platform}-${index}`} className="flex justify-between items-center border-b border-border pb-3 last:border-0 last:pb-0">
                      <span className="font-semibold text-muted-foreground">{p.platform}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-xl font-bold text-foreground">₹{p.price}</span>
                        <Button size="sm" asChild variant="outline" className="rounded-full">
                          <a href={p.link || "#"} target="_blank">Book Deal</a>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">No external prices found for this stay.</p>
                )}
              </div>
            </div>

            {/* Contact Details - Matches your host_ fields in DB */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold">Contact Host</h2>
              <div className="grid grid-cols-1 gap-3">
                <Button className="justify-start gap-4 py-6" variant="secondary">
                  <Phone size={20} className="text-primary" /> 
                  <span className="font-medium">{stay.hostContact?.phone || "Request Number"}</span>
                </Button>
                <Button className="justify-start gap-4 py-6" variant="secondary">
                  <Mail size={20} className="text-primary" />
                  <span className="font-medium">{stay.hostContact?.email || "Request Email"}</span>
                </Button>
                <Button className="justify-start gap-4 py-6 bg-[#25D366] hover:bg-[#128C7E] text-white border-none">
                  <MessageCircle size={20} />
                  <span className="font-medium">Chat on WhatsApp</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
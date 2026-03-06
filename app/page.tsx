import { Navbar } from "@/components/navbar"
import { SearchBar } from "@/components/search-bar"
import { StaysGrid } from "@/components/stays-grid"
import { MapSection } from "@/components/map-section"
import { ReviewSection } from "@/components/review-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <SearchBar />
        <StaysGrid />
        <MapSection />
        <ReviewSection />
      </main>
      <Footer />
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin, Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Find Your Stay</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Explore
          </Link>
          <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Experiences
          </Link>
          <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Become a Host
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" className="text-sm font-medium">
            Log in
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <User className="mr-2 h-4 w-4" />
            Sign up
          </Button>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Explore
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Experiences
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Become a Host
            </Link>
            <hr className="border-border" />
            <Button variant="ghost" size="sm" className="justify-start px-0 text-sm font-medium">
              Log in
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <User className="mr-2 h-4 w-4" />
              Sign up
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

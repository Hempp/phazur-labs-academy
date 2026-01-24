// Custom 404 Page
// Branded error page with helpful navigation

import Link from 'next/link'
import { Home, Search, BookOpen, ArrowLeft, HelpCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold text-primary/10 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border">
              <BookOpen className="w-16 h-16 text-primary mx-auto mb-2" />
              <p className="text-lg font-medium text-foreground">Page Not Found</p>
            </div>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Oops! This page seems to be on a learning break
        </h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track with your learning journey.
        </p>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto mb-8">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link
            href="/courses"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
          >
            <BookOpen className="w-5 h-5" />
            Browse Courses
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="border-t pt-8">
          <p className="text-sm text-muted-foreground mb-4">Or try one of these:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard/student"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              My Dashboard
            </Link>
            <Link
              href="/help"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              Help Center
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Search className="w-4 h-4" />
              Contact Support
            </Link>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="mt-12 p-4 bg-primary/5 rounded-lg border border-primary/10">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-primary">Did you know?</span> The 404 error code
            comes from the room number at CERN where the original web servers were located!
          </p>
        </div>
      </div>
    </div>
  )
}

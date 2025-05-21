"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useOrientation } from "@/hooks/use-orientation"
import { OrientationMessage } from "@/components/orientation-message"

const onboardingSlides = [
  {
    id: 1,
    svg: "/images/svg1.svg",
    title: "Navigate with confidence",
    description: "Effortless insurance policy management",
    alt: "Insurance policy management illustration",
  },
  {
    id: 2,
    svg: "/images/svg2.svg",
    title: "Drive towards a cleaner future",
    description: "Check & manage vehicle PUC",
    alt: "PUC certificate management illustration",
  },
  {
    id: 3,
    svg: "/images/svg3.svg",
    title: "Fast-Track Your Journey",
    description: "Seamless FASTag experience",
    alt: "FASTag illustration",
  },
  {
    id: 4,
    svg: "/images/svg4.svg",
    title: "Stay free of traffic fines",
    description: "Track and manage your vehicle challans",
    alt: "Traffic challan management illustration",
  },
  {
    id: 5,
    svg: "/images/svg5.svg",
    title: "Get help in case of an emergency",
    description: "Receive assistance in case of an emergency",
    alt: "Emergency assistance illustration",
  },
]

export default function OnboardingCarousel() {
  const router = useRouter()
  const orientation = useOrientation()
  const [activeSlide, setActiveSlide] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [slideRatings, setSlideRatings] = useState<Record<number, "up" | "down" | null>>({})
  const [isPaused, setIsPaused] = useState(false)
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-scroll functionality
  useEffect(() => {
    // Start the auto-scroll timer
    const startAutoScroll = () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current)
      }

      autoScrollTimerRef.current = setInterval(() => {
        if (!isPaused) {
          handleNext()
        }
      }, 3000)
    }

    startAutoScroll()

    // Clean up on unmount
    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current)
      }
    }
  }, [activeSlide, isPaused])

  // Pause auto-scroll when user is interacting
  const pauseAutoScroll = () => {
    setIsPaused(true)
  }

  const resumeAutoScroll = () => {
    setIsPaused(false)
  }

  const handleNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        // Circular navigation: if at the last slide, go back to the first
        setActiveSlide((prev) => (prev === onboardingSlides.length - 1 ? 0 : prev + 1))
        setIsTransitioning(false)
      }, 300)
    }
  }

  const handlePrev = () => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        // Circular navigation: if at the first slide, go to the last
        setActiveSlide((prev) => (prev === 0 ? onboardingSlides.length - 1 : prev - 1))
        setIsTransitioning(false)
      }, 300)
    }
  }

  const handleDotClick = (index: number) => {
    if (index !== activeSlide && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveSlide(index)
        setIsTransitioning(false)
      }, 300)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
    pauseAutoScroll()
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!isTransitioning) {
      if (touchStart - touchEnd > 75) {
        // Swipe left
        handleNext()
      }

      if (touchStart - touchEnd < -75) {
        // Swipe right
        handlePrev()
      }
    }

    // Resume auto-scroll after a short delay
    setTimeout(resumeAutoScroll, 5000)
  }

  const handleThumbsRating = (slideId: number, rating: "up" | "down") => {
    setSlideRatings((prev) => {
      // If the same rating is clicked again, remove it (toggle behavior)
      if (prev[slideId] === rating) {
        const newRatings = { ...prev }
        delete newRatings[slideId]
        return newRatings
      }
      // Otherwise set the new rating
      return { ...prev, [slideId]: rating }
    })
  }

  const handleExploreClick = () => {
    // Pause auto-scroll
    pauseAutoScroll()
    // Navigate to dashboard
    router.push("/dashboard")
  }

  // Show orientation message if in landscape mode
  if (orientation === "landscape") {
    return <OrientationMessage />
  }

  // Only render the app content in portrait mode
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Carousel container - now full width and height */}
      <div
        className="relative flex-1 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Content area */}
        <div className="h-full pb-[140px] overflow-y-auto">
          {/* Slides with framer-motion animations */}
          <AnimatePresence mode="wait">
            {onboardingSlides.map(
              (slide, index) =>
                activeSlide === index && (
                  <motion.div
                    key={slide.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex flex-col"
                  >
                    {/* SVG image with 55% viewport height and full width */}
                    <div className="w-full h-[55vh] overflow-hidden">
                      <Image
                        src={
                          index === 1
                            ? "/images/svg2.svg"
                            : index === 2
                              ? "/images/svg3.svg"
                              : index === 3
                                ? "/images/svg4.svg"
                                : index === 4
                                  ? "/images/svg5.svg"
                                  : "/images/svg1.svg"
                        }
                        alt="Motor club illustration"
                        width={1200}
                        height={800}
                        className="w-full h-full object-cover object-center"
                        priority
                      />
                    </div>

                    {/* Content */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                      className="px-6 py-8 flex flex-col items-center"
                    >
                      <h1 className="text-xl font-bold mb-2 text-center text-gray-800">{slide.title}</h1>
                      <p className="text-gray-600 mb-8 text-center">{slide.description}</p>
                    </motion.div>
                  </motion.div>
                ),
            )}
          </AnimatePresence>
        </div>

        {/* Fixed bottom section with pagination and buttons */}
        <div className="absolute bottom-0 left-0 right-0 bg-white pt-4 px-6 pb-4">
          {/* Pagination dots with moving indicator */}
          <div className="flex justify-center mb-8 relative">
            <div className="flex space-x-1.5">
              {onboardingSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className="w-1.5 h-1.5 rounded-full bg-indigo-100 relative z-10"
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            {/* Moving active indicator */}
            <motion.div
              className="absolute top-0 w-1.5 h-1.5 bg-indigo-700 rounded-full z-20"
              animate={{
                left: `calc(50% - ${(onboardingSlides.length * 6 + (onboardingSlides.length - 1) * 6) / 2}px + ${
                  activeSlide * 12
                }px)`,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>

          {/* Button group - fixed at bottom with 16px padding */}
          <div className="space-y-3">
            {/* Primary Button */}
            <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
              <button
                className="w-full h-[48px] px-4 bg-indigo-700 text-white font-bold rounded-[12px] flex items-center justify-center transition-colors active:bg-indigo-800"
                style={{ borderRadius: "12px" }}
                onClick={handleExploreClick}
              >
                <span>Explore motor club</span>
                <ArrowRight className="ml-2 h-5 w-5" strokeWidth={1.5} />
              </button>
            </motion.div>

            {/* Tertiary Button */}
            <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
              <button
                className="w-full h-[48px] px-4 text-gray-400 font-bold rounded-[12px] flex items-center justify-center transition-colors active:text-gray-500"
                style={{ borderRadius: "12px" }}
                onClick={pauseAutoScroll}
              >
                Go back
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

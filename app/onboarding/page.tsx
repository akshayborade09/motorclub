"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react"
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
  const orientation = useOrientation()
  const [activeSlide, setActiveSlide] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [slideRatings, setSlideRatings] = useState<Record<number, "up" | "down" | null>>({})

  const handleNext = () => {
    if (activeSlide < onboardingSlides.length - 1 && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveSlide((prev) => prev + 1)
        setIsTransitioning(false)
      }, 300)
    }
  }

  const handlePrev = () => {
    if (activeSlide > 0 && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveSlide((prev) => prev - 1)
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
                    {/* SVG image full width */}
                    <div className="w-full">
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
                        width={393}
                        height={320}
                        className="w-full h-auto"
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
                      <p className="text-gray-600 mb-4 text-center">{slide.description}</p>

                      {/* Thumbs rating section */}
                      <div className="flex items-center justify-center space-x-8 mt-4 mb-4">
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          transition={{ duration: 0.1 }}
                          onClick={() => handleThumbsRating(slide.id, "up")}
                          className={`p-3 rounded-full ${
                            slideRatings[slide.id] === "up"
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                          aria-label="Thumbs up"
                        >
                          <ThumbsUp className="h-6 w-6" />
                        </motion.button>

                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          transition={{ duration: 0.1 }}
                          onClick={() => handleThumbsRating(slide.id, "down")}
                          className={`p-3 rounded-full ${
                            slideRatings[slide.id] === "down" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                          }`}
                          aria-label="Thumbs down"
                        >
                          <ThumbsDown className="h-6 w-6" />
                        </motion.button>
                      </div>

                      {/* Feedback message based on rating */}
                      <AnimatePresence mode="wait">
                        {slideRatings[slide.id] && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`text-sm font-medium ${
                              slideRatings[slide.id] === "up" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {slideRatings[slide.id] === "up"
                              ? "Thanks for your positive feedback!"
                              : "We appreciate your feedback and will improve this."}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                ),
            )}
          </AnimatePresence>
        </div>

        {/* Fixed bottom section with pagination and buttons */}
        <div className="absolute bottom-0 left-0 right-0 bg-white pt-4 px-6 pb-6">
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

          {/* Button group - fixed at bottom with 24px padding */}
          <div className="space-y-3">
            {/* Primary Button */}
            <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
              <button
                className="w-full h-[48px] px-4 bg-indigo-700 text-white font-bold rounded-[12px] flex items-center justify-center transition-colors active:bg-indigo-800"
                style={{ borderRadius: "12px" }}
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

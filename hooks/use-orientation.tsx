"use client"

import { useState, useEffect } from "react"

type Orientation = "portrait" | "landscape"

export function useOrientation() {
  const [orientation, setOrientation] = useState<Orientation>("portrait")

  useEffect(() => {
    // Function to update orientation state
    const updateOrientation = () => {
      if (window.matchMedia("(orientation: portrait)").matches) {
        setOrientation("portrait")
      } else {
        setOrientation("landscape")
      }
    }

    // Initial check
    updateOrientation()

    // Create media query list to watch for orientation changes
    const mediaQuery = window.matchMedia("(orientation: portrait)")

    // Modern event listener
    const handleChange = (e: MediaQueryListEvent) => {
      setOrientation(e.matches ? "portrait" : "landscape")
    }

    // Add event listener
    mediaQuery.addEventListener("change", handleChange)

    // Clean up
    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  return orientation
}

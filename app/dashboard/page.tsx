"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import {
  ArrowRight,
  Shield,
  Car,
  FileText,
  Activity,
  Plus,
  MapPin,
  ChevronDown,
  AlertTriangle,
  MoreVertical,
} from "lucide-react"
import { motion, useAnimation, type PanInfo } from "framer-motion"

export default function Dashboard() {
  const [selectedVehicle, setSelectedVehicle] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  const vehicles = [
    {
      id: 1,
      name: "Maruti Suzuki Dzire",
      image: "/images/maruti-dzire.png",
      licensePlate: "MH 02 Z 2663",
    },
    {
      id: 2,
      name: "Honda City",
      image: "/images/honda-city.png",
      licensePlate: "MH 04 AB 1234",
    },
    {
      id: 3,
      name: "Royal Enfield Classic",
      image: "/images/royal-enfield.png",
      licensePlate: "MH 02 CD 5678",
    },
  ]

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    const threshold = 50 // minimum distance required for a swipe

    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0 && selectedVehicle > 0) {
        // Swiped right, go to previous vehicle
        controls
          .start({
            x: "20%",
            transition: { duration: 0.3 },
          })
          .then(() => {
            setSelectedVehicle(selectedVehicle - 1)
            controls.set({ x: 0 })
          })
      } else if (info.offset.x < 0 && selectedVehicle < vehicles.length - 1) {
        // Swiped left, go to next vehicle
        controls
          .start({
            x: "-20%",
            transition: { duration: 0.3 },
          })
          .then(() => {
            setSelectedVehicle(selectedVehicle + 1)
            controls.set({ x: 0 })
          })
      } else {
        // Snap back to current if at the ends
        controls.start({
          x: 0,
          transition: { type: "spring", stiffness: 300, damping: 30 },
        })
      }
    } else {
      // If not dragged far enough, snap back
      controls.start({
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      })
    }
  }

  const handlePrevious = () => {
    if (selectedVehicle > 0) {
      setSelectedVehicle(selectedVehicle - 1)
    }
  }

  const handleNext = () => {
    if (selectedVehicle < vehicles.length - 1) {
      setSelectedVehicle(selectedVehicle + 1)
    }
  }

  // Get the previous, current, and next vehicles for the carousel
  const getPrevVehicle = () => {
    return selectedVehicle > 0 ? vehicles[selectedVehicle - 1] : null
  }

  const getCurrentVehicle = () => {
    return vehicles[selectedVehicle]
  }

  const getNextVehicle = () => {
    return selectedVehicle < vehicles.length - 1 ? vehicles[selectedVehicle + 1] : null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* App header */}
      <header className="bg-white px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Motor Club</h1>
        <div className="flex items-center gap-3">
          <button className="bg-red-500 text-white p-2 rounded-lg flex flex-col items-center justify-center w-10 h-10">
            <span className="text-xs font-bold">SOS</span>
          </button>
          <button className="p-2.5 bg-gray-100 rounded-full">
            <MoreVertical size={20} className="text-gray-900" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="px-4 pb-6">
        {/* Vehicle display - Swipable Carousel */}
        <div className="mt-[44px] relative">
          <div ref={carouselRef} className="relative overflow-hidden py-4">
            <motion.div
              className="flex items-center justify-center relative"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
              animate={controls}
            >
              {/* Previous Vehicle (showing 20% of screen) */}
              {getPrevVehicle() && (
                <motion.div
                  className="absolute z-0 w-[20%]"
                  initial={{ scale: 0.6, opacity: 0.7, x: "-20%" }}
                  animate={{ scale: 0.6, opacity: 0.7, x: "-20%" }}
                  whileHover={{ scale: 0.65 }}
                >
                  <div className="w-full h-[120px] bg-gray-300 rounded-md" />
                </motion.div>
              )}

              {/* Current Vehicle (60% of screen width) */}
              <motion.div className="relative z-10 w-[60%]" initial={{ scale: 1 }} animate={{ scale: 1 }}>
                <div className="w-full h-[120px] bg-black rounded-md" />
              </motion.div>

              {/* Next Vehicle (showing 20% of screen) */}
              {getNextVehicle() && (
                <motion.div
                  className="absolute z-0 w-[20%]"
                  initial={{ scale: 0.6, opacity: 0.7, x: "20%" }}
                  animate={{ scale: 0.6, opacity: 0.7, x: "20%" }}
                  whileHover={{ scale: 0.65 }}
                >
                  <div className="w-full h-[120px] bg-gray-300 rounded-md" />
                </motion.div>
              )}
            </motion.div>
          </div>

          <h2 className="text-center text-xl font-bold mt-2">{getCurrentVehicle().name}</h2>
          <div className="flex justify-center mt-2">
            <div className="bg-blue-900 text-white text-sm px-3 py-1 rounded-md flex items-center gap-1">
              {getCurrentVehicle().licensePlate}
            </div>
          </div>
        </div>

        {/* Vehicle selector */}
        <div className="mt-4 flex justify-center">
          <div className="flex items-center gap-6 pt-4 px-2">
            {vehicles.map((vehicle, index) => (
              <button
                key={vehicle.id}
                onClick={() => setSelectedVehicle(index)}
                className={`flex flex-col items-center ${selectedVehicle === index ? "opacity-100" : "opacity-50"}`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={vehicle.image || "/placeholder.svg?height=40&width=40&query=vehicle"}
                    alt={vehicle.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                {selectedVehicle === index && <div className="h-1 w-8 bg-indigo-700 rounded-full mt-1" />}
              </button>
            ))}
            <button className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Plus size={20} />
              </div>
            </button>
          </div>
        </div>

        {/* Insurance card */}
        <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-gray-800" />
              <span className="font-semibold">Insurance</span>
              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full font-medium">Active</span>
            </div>
            <span className="text-sm text-gray-600">valid till 23 Jan 2025</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold text-xs">ACKO</span>
              </div>
              <div>
                <div className="font-medium">Acko General Insurance</div>
                <div className="text-sm text-gray-600">Comprehensive policy</div>
              </div>
            </div>
            <ArrowRight size={20} className="text-gray-400" />
          </div>
        </div>

        {/* FASTag card */}
        <div className="mt-4 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Car size={20} className="text-gray-800" />
              <span className="font-semibold">FASTag</span>
              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full font-medium">Active</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                <Image src="/generic-financial-logo.png" alt="HDFC Bank" width={30} height={30} />
              </div>
              <div>
                <div className="font-medium">HDFC Bank</div>
                <div className="text-sm font-semibold">₹ 510</div>
              </div>
            </div>
            <button className="bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center">
              Recharge <ArrowRight size={16} className="ml-1" />
            </button>
          </div>
        </div>

        {/* Challan card */}
        <div className="mt-4 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-gray-800" />
              <span className="font-semibold">Challan</span>
            </div>
            <div className="flex items-center gap-1 text-red-500 text-sm">
              <AlertTriangle size={16} />
              <span>Needs attention</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <div className="font-medium">1 Challan found</div>
              <div className="text-sm text-gray-600">last checked on 03 Mar 2025</div>
            </div>
            <button className="bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center">
              Pay now <ArrowRight size={16} className="ml-1" />
            </button>
          </div>
        </div>

        {/* PUC card */}
        <div className="mt-4 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Activity size={20} className="text-gray-800" />
              <span className="font-semibold">PUC</span>
              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full font-medium">Active</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <div className="text-sm text-gray-600">expiry 03 Mar 2025</div>
            </div>
            <button className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg text-sm font-medium">
              Set reminder
            </button>
          </div>
        </div>

        {/* Fuel prices */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="font-bold text-lg">Fuel prices</h3>
              <p className="text-sm text-gray-600">updated as of 6th March 2024</p>
            </div>
            <button className="flex items-center gap-1 text-sm">
              <MapPin size={16} />
              <span>Location: Delhi</span>
              <ChevronDown size={16} />
            </button>
          </div>

          <div className="bg-white rounded-xl p-4 grid grid-cols-3 gap-4 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="mb-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-800">⛽</span>
                </div>
              </div>
              <div className="text-sm text-center">Petrol</div>
              <div className="font-bold text-lg mt-1">₹ 103.21</div>
              <div className="text-xs text-gray-500">per litre</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-800">🛢️</span>
                </div>
              </div>
              <div className="text-sm text-center">Diesel</div>
              <div className="font-bold text-lg mt-1">₹ 99.87</div>
              <div className="text-xs text-gray-500">per litre</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-800">🍃</span>
                </div>
              </div>
              <div className="text-sm text-center">CNG</div>
              <div className="font-bold text-lg mt-1">₹ 72.65</div>
              <div className="text-xs text-gray-500">per kg</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

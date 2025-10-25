"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { cn } from "@/lib/utils"

interface InteractiveHotspotProps {
  position: {
    top?: string
    bottom?: string
    left?: string
    right?: string
  }
  tooltip: string
  onClick: () => void
  className?: string
  delay?: number
}

export function InteractiveHotspot({ position, tooltip, onClick, className, delay = 0 }: InteractiveHotspotProps) {
  const [isHovered, setIsHovered] = useState(false)
  const hotspotRef = useRef<HTMLButtonElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hotspotRef.current) return

    // Pulse animation
    gsap.to(hotspotRef.current, {
      scale: 1.1,
      opacity: 0.8,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      delay,
    })
  }, [delay])

  useEffect(() => {
    if (!tooltipRef.current) return

    if (isHovered) {
      gsap.to(tooltipRef.current, {
        opacity: 1,
        y: -10,
        duration: 0.3,
        ease: "power2.out",
      })
    } else {
      gsap.to(tooltipRef.current, {
        opacity: 0,
        y: 0,
        duration: 0.2,
        ease: "power2.in",
      })
    }
  }, [isHovered])

  return (
    <button
      ref={hotspotRef}
      className={cn(
        "absolute z-10 cursor-pointer",
        className,
      )}
      style={position}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={tooltip}
    >
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/90 px-3 py-1.5 text-sm font-medium text-white opacity-0"
      >
        {tooltip}
      </div>
    </button>
  )
}

"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback, memo } from "react"
import { gsap } from "gsap"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoSliderModalProps {
  isOpen: boolean
  onClose: () => void
  type: "storywave" | "reel"
}

// Placeholder video URLs - replace with actual video URLs
const VIDEOS = {
  storywave: [
    "/assets/webm/00 Logline Slide.webm",
    "/assets/webm/page1.webm",
    "/assets/webm/02 Slide 2(Fixed).webm",
    "/assets/webm/page3.webm",
  ],
  reel: [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bgnew-R6SvSyhACBBxGeHHWKIodla9dS5TdG.webm",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bgnew-R6SvSyhACBBxGeHHWKIodla9dS5TdG.webm",
  ],
}

const NavigationButton = memo(
  ({
    direction,
    onClick,
    className,
  }: {
    direction: "left" | "right"
    onClick: () => void
    className?: string
  }) => (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-110 ${className}`}
      onClick={onClick}
      aria-label={direction === "left" ? "Previous slide" : "Next slide"}
    >
      {direction === "left" ? <ChevronLeft className="h-8 w-8" /> : <ChevronRight className="h-8 w-8" />}
    </Button>
  ),
)
NavigationButton.displayName = "NavigationButton"

export function VideoSliderModal({ isOpen, onClose, type }: VideoSliderModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const slideRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  const videos = VIDEOS[type]

  const cleanup = useCallback(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause()
        video.currentTime = 0
      }
    })
  }, [])

  useEffect(() => {
    if (!modalRef.current || !contentRef.current) return

    if (isOpen) {
      gsap.set(modalRef.current, { display: "flex" })
      gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" })
      gsap.fromTo(
        contentRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.2)", delay: 0.1 },
      )
      setTimeout(() => {
        videoRefs.current[0]?.play()
      }, 600)
    } else {
      cleanup()

      gsap.to(contentRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      })
      gsap.to(modalRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(modalRef.current, { display: "none" })
          setCurrentIndex(0)
        },
      })
    }

    return cleanup
  }, [isOpen, cleanup])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev()
      } else if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, currentIndex, videos.length])

  const animateSlide = useCallback(
    (newIndex: number, direction: "next" | "prev") => {
      if (!slideRef.current || isAnimating || newIndex === currentIndex) return

      setIsAnimating(true)
      const xOffset = direction === "next" ? -100 : 100

      // Pause current video
      videoRefs.current[currentIndex]?.pause()

      // Use transform for better performance
      gsap.to(slideRef.current, {
        x: `${xOffset}%`,
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          setCurrentIndex(newIndex)
          gsap.fromTo(
            slideRef.current,
            { x: `${-xOffset}%`, opacity: 0 },
            {
              x: "0%",
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",
              onComplete: () => {
                setIsAnimating(false)
                const nextIdx = newIndex + 1
                const prevIdx = newIndex - 1
                if (nextIdx < videos.length) {
                  videoRefs.current[nextIdx]?.load()
                }
                if (prevIdx >= 0) {
                  videoRefs.current[prevIdx]?.load()
                }
              },
            },
          )
          // Play new video
          videoRefs.current[newIndex]?.play()
        },
      })
    },
    [currentIndex, isAnimating, videos.length],
  )

  const handleNext = useCallback(() => {
    if (currentIndex < videos.length - 1 && !isAnimating) {
      animateSlide(currentIndex + 1, "next")
    }
  }, [currentIndex, videos.length, isAnimating, animateSlide])

  const handlePrev = useCallback(() => {
    if (currentIndex > 0 && !isAnimating) {
      animateSlide(currentIndex - 1, "prev")
    }
  }, [currentIndex, isAnimating, animateSlide])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        handleNext()
      } else {
        handlePrev()
      }
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 hidden items-center justify-center bg-black"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div ref={contentRef} className="relative h-screen w-screen" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 px-10 top-4 z-10 rounded-sm bg-yellow-500 text-black backdrop-blur-sm transition-all  hover:scale-110"
          onClick={onClose}
          aria-label="Close modal"
        >
          CLOSE
        </Button>

        <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
          {currentIndex + 1} / {videos.length}
        </div>

        <div className="flex h-full items-center justify-center">
          <div ref={slideRef} className="relative h-screen w-screen">
            {videos.map((videoUrl, index) => (
              <video
                key={index}
                ref={(el) => (videoRefs.current[index] = el)}
                className={`h-full w-full object-cover ${index === currentIndex ? "block" : "hidden"}`}
                loop
                playsInline
                preload={index === 0 ? "auto" : "metadata"}
                onLoadedMetadata={(e) => {
                  if (index === currentIndex) {
                    const video = e.currentTarget
                    video.muted = false
                    video.play().catch(() => {
                      video.muted = true
                      video.play()
                    })
                  }
                }}
              >
                <source src={videoUrl} type="video/webm" />
              </video>
            ))}
          </div>
        </div>

        {currentIndex > 0 && (
          <NavigationButton
            direction="left"
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2"
          />
        )}

        {currentIndex < videos.length - 1 && (
          <NavigationButton
            direction="right"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          />
        )}

        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
          {videos.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all hover:scale-110 ${
                index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
              }`}
              onClick={() => {
                if (index !== currentIndex && !isAnimating) {
                  animateSlide(index, index > currentIndex ? "next" : "prev")
                }
              }}
              disabled={isAnimating}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

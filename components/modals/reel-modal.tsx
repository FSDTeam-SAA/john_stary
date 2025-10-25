"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface ReelModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ReelModal({ isOpen, onClose }: ReelModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!modalRef.current) return

    if (isOpen) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" },
      )

      // Play video when modal opens
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.play().catch((err) => {
          console.log("[v0] Video autoplay failed:", err)
        })
      }
    } else {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.in",
      })

      // Pause video when modal closes
      if (videoRef.current) {
        videoRef.current.pause()
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div
        ref={modalRef}
        className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-[#FDB913] hover:bg-[#FDB913]/90 text-black px-4 py-2 rounded font-bold transition-colors"
        >
          CLOSE
        </button>

        {/* Video */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          loop
          playsInline
          muted={false}
          onLoadedMetadata={(e) => {
            const video = e.currentTarget
            video.muted = false
            video.play().catch(() => {
              video.muted = true
              video.play()
            })
          }}
        >
          <source src="/assets/webm/mixtape_4.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  )
}

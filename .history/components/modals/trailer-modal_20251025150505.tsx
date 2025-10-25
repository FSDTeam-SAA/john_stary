"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"

interface TrailerModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TrailerModal({ isOpen, onClose }: TrailerModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!modalRef.current || !contentRef.current) return

    if (isOpen) {
      gsap.set(modalRef.current, { display: "flex" })
      gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" })
      gsap.fromTo(
        contentRef.current,
        { scale: 0.9, y: 50, opacity: 0 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.5)",
          delay: 0.1,
          onComplete: () => {
            videoRef.current?.play()
          },
        },
      )
    } else {
      videoRef.current?.pause()

      gsap.to(contentRef.current, {
        scale: 0.9,
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      })
      gsap.to(modalRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(modalRef.current, { display: "none" })
        },
      })
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 hidden items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <div
        ref={contentRef}
        className="relative w-full max-w-5xl aspect-video overflow-hidden rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-10 rounded-md bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm hover:bg-white/20"
          onClick={onClose}
        >
          CLOSE
        </Button>

        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          loop
          playsInline
          preload="metadata"
          onLoadedMetadata={(e) => {
            const video = e.currentTarget
            video.muted = false
            video.play().catch(() => {
              video.muted = true
              video.play()
            })
          }}
        >
          <source
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bgnew-R6SvSyhACBBxGeHHWKIodla9dS5TdG.webm"
            type="video/webm"
          />
        </video>
      </div>
    </div>
  )
}

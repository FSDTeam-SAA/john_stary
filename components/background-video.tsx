"use client"

import type React from "react"

import { forwardRef, useEffect, useRef } from "react"

export const BackgroundVideo = forwardRef<HTMLVideoElement>((props, ref) => {
  const internalRef = useRef<HTMLVideoElement>(null)
  const videoRef = (ref as React.RefObject<HTMLVideoElement>) || internalRef

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = false
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true
          videoRef.current.play()
        }
      })
    }
  }, [videoRef])

  return (
    <div className="absolute inset-0 z-0">
      <video ref={videoRef} className="h-full w-full object-cover" autoPlay loop playsInline preload="metadata">
        <source
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bgnew-R6SvSyhACBBxGeHHWKIodla9dS5TdG.webm"
          type="video/webm"
        />
      </video>
      <div className="absolute inset-0 bg-black/20" />
    </div>
  )
})

BackgroundVideo.displayName = "BackgroundVideo"

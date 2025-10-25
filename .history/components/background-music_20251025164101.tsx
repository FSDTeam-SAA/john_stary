"use client"

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react"

export interface BackgroundMusicHandle {
  pause: () => void
  play: () => void
}

interface BackgroundMusicProps {
  src: string
}

export const BackgroundMusic = forwardRef<BackgroundMusicHandle, BackgroundMusicProps>(({ src }, ref) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  useImperativeHandle(ref, () => ({
    pause: () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause()
      }
    },
    play: () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch((error) => {
          console.error("Failed to play background music:", error)
        })
      }
    },
  }))

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Attempt to autoplay with user interaction fallback
    const playAudio = () => {
      audio.play().catch((error) => {
        console.log("Autoplay prevented, waiting for user interaction:", error)
      })
    }

    // Try to play immediately
    playAudio()

    // Fallback: play on first user interaction
    const handleInteraction = () => {
      playAudio()
      document.removeEventListener("click", handleInteraction)
      document.removeEventListener("touchstart", handleInteraction)
    }

    document.addEventListener("click", handleInteraction)
    document.addEventListener("touchstart", handleInteraction)

    return () => {
      document.removeEventListener("click", handleInteraction)
      document.removeEventListener("touchstart", handleInteraction)
    }
  }, [])

  return <audio ref={audioRef} src={src} loop preload="auto" className="hidden" />
})

BackgroundMusic.displayName = "BackgroundMusic"

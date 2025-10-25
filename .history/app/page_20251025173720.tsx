"use client"

import { useState, useRef, useCallback } from "react"
import { BackgroundVideo } from "@/components/background-video"
import { BackgroundMusic, type BackgroundMusicHandle } from "@/components/background-music"
import { InteractiveHotspot } from "@/components/interactive-hotspot"
import { BioModal } from "@/components/modals/bio-modal"
import { RecoveryModal } from "@/components/modals/recovery-modal"
import { VideoSliderModal } from "@/components/modals/video-slider-modal"
import { TrailerModal } from "@/components/modals/trailer-modal"
import { ReelModal } from "@/components/modals/reel-modal"

export default function HomePage() {
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const musicRef = useRef<BackgroundMusicHandle>(null)
  const [videoTime, setVideoTime] = useState(0)

  const handleOpenModal = useCallback((modalName: string) => {
    if (videoRef.current) {
      setVideoTime(videoRef.current.currentTime)
      videoRef.current.pause()
    }
    if (["storywave", "reel", "trailer"].includes(modalName)) {
      musicRef.current?.pause()
    }
    setActiveModal(modalName)
  }, [])

  const handleCloseModal = useCallback(() => {
    setActiveModal(null)
    requestAnimationFrame(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = videoTime
        videoRef.current.play()
      }
      musicRef.current?.play()
    })
  }, [videoTime])

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <BackgroundVideo ref={videoRef} />
      <BackgroundMusic ref={musicRef} src="/assets/audio/Little Black Boy.mp3" />

      {/* Interactive Hotspots */}
      <InteractiveHotspot
        position={{ top: "40%", left: "50%" }}
        tooltip="PLAY - STORYWAVE"
        onClick={() => handleOpenModal("storywave")}
        className="w-52 h-14"
      />

      <InteractiveHotspot
        position={{ top: "57%", left: "48%" }}
        tooltip="BIO"
        onClick={() => handleOpenModal("bio")}
        className="w-32 h-40"
      />

      <InteractiveHotspot
        position={{ top: "35%", right: "18%" }}
        tooltip="RECOVERY"
        onClick={() => handleOpenModal("recovery")}
        className="w-24 h-32"
      />

      <InteractiveHotspot
        position={{ bottom: "38%", left: "28%" }}
        tooltip="REEL"
        onClick={() => handleOpenModal("reel")}
        className="w-20 h-20 rounded-full"
      />

      <InteractiveHotspot
        position={{ top: "15%", left: "50%" }}
        tooltip="TRAILER"
        onClick={() => handleOpenModal("trailer")}
        className="w-32 h-16 -translate-x-1/2"
        delay={0.1}
      />

      {activeModal === "bio" && <BioModal isOpen={true} onClose={handleCloseModal} />}
      {activeModal === "recovery" && <RecoveryModal isOpen={true} onClose={handleCloseModal} />}
      {activeModal === "storywave" && <VideoSliderModal isOpen={true} onClose={handleCloseModal} type="storywave" />}
      {activeModal === "reel" && <ReelModal isOpen={true} onClose={handleCloseModal} />}
      {activeModal === "trailer" && <TrailerModal isOpen={true} onClose={handleCloseModal} />}
    </main>
  )
}

"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"

interface RecoveryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RecoveryModal({ isOpen, onClose }: RecoveryModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!modalRef.current || !contentRef.current) return

    if (isOpen) {
      gsap.set(modalRef.current, { display: "flex" })
      gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" })
      gsap.fromTo(
        contentRef.current,
        { scale: 0.9, opacity: 0, rotationY: -15 },
        {
          scale: 1,
          opacity: 1,
          rotationY: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
          delay: 0.1,
        },
      )
    } else {
      gsap.to(contentRef.current, {
        scale: 0.9,
        opacity: 0,
        rotationY: 15,
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
      className="fixed inset-0 z-50 hidden items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        ref={contentRef}
        className="relative w-full max-w-4xl aspect-video overflow-hidden rounded-xl bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-10 rounded-md bg-amber-500 px-4 py-2 text-sm font-bold text-black hover:bg-amber-600"
          onClick={onClose}
        >
          CLOSE
        </Button>

        <img
          src=""
          alt="Recovery Journey"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  )
}

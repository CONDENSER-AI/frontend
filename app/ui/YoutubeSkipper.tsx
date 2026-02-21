"use client"
import { useEffect, useRef } from "react"

type SkipSection = {
  from: number
  to: number
}

type Props = {
  videoId: string
  skipMap: SkipSection[]
}

export default function YouTubeSkipper({ videoId, skipMap }: Props) {
    
  const playerRef = useRef<any>(null)
  const intervalRef = useRef<any>(null)

  useEffect(() => {
    // Load YT API once

    // @ts-expect-error - YT types are not well defined
    if (!window.YT) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      document.body.appendChild(tag)
    }

    // @ts-expect-error - YT types are not well defined
    window.onYouTubeIframeAPIReady = () => {
      // @ts-expect-error - YT types are not well defined
      playerRef.current = new YT.Player("yt-player", {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
        },
        events: {
          onReady: onPlayerReady,
        },
      })
    }

    return () => {
      clearInterval(intervalRef.current)
    }
  }, [])

  const onPlayerReady = () => {
    intervalRef.current = setInterval(() => {
      const player = playerRef.current
      if (!player || typeof player.getCurrentTime !== "function") return

      const currentTime = player.getCurrentTime()

      for (const section of skipMap) {
        if (currentTime >= section.from && currentTime < section.to) {
          player.seekTo(section.to, true)
          break
        }
      }
    }, 300) // 300ms is a good balance
  }

  return (
    <div className="w-full max-w-3xl aspect-video">
      <div id="yt-player" className="w-full h-full" />
    </div>
  )
}
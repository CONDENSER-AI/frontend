"use client"
import Navbar from "../ui/Navbar"
import YouTubeSkipper from "../ui/YoutubeSkipper"

export default function Page() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-6 mt-6">
      <Navbar />

      <YouTubeSkipper
        videoId="TjZBTDzGeGg"
        skipMap={[
          { from: 0, to: 60 },    
          { from: 122, to: 140 },   
        ]}
      />
    </div>
  )
}
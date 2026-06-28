'use client'

import { useState, useEffect, useRef } from 'react'

interface SkipSegment { startSeconds: number; endSeconds: number; reason?: string; contentPreview?: string; durationSeconds: number; startTime?: string; endTime?: string; }
interface SegmentItem { start?: number; end?: number; label?: string; startTime?: string; endTime?: string; section?: string; content?: string; durationSeconds: number; }

export default function SkipMapViewer({ lectureId }: { lectureId: string }) {
    const [skipMap, setSkipMap] = useState<SkipSegment[]>([])
    const [segments, setSegments] = useState<SegmentItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentTime, setCurrentTime] = useState(0)
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        fetchLectureData()
    }, [lectureId])

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime)
        }

        video.addEventListener('timeupdate', handleTimeUpdate)
        return () => video.removeEventListener('timeupdate', handleTimeUpdate)
    }, [])

    const fetchLectureData = async () => {
        try {
            setLoading(true)
            const resp = await fetch(`/api/lectures/${lectureId}`)
            if (!resp.ok) throw new Error('Failed to fetch lecture data')
            const data = await resp.json()
            setSkipMap(data.skipMap || [])
            setSegments(data.segments || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
        } finally {
            setLoading(false)
        }
    }

    const handleSkipSegment = (skipSegment: SkipSegment) => {
        if (videoRef.current) {
            videoRef.current.currentTime = skipSegment.endSeconds
        }
    }

    const isInSkipZone = (time: number) => {
        return skipMap.some(
            skip => time >= skip.startSeconds && time < skip.endSeconds
        )
    }

    const getCurrentSkipSegment = (): SkipSegment | undefined => {
        return skipMap.find(
            skip => currentTime >= skip.startSeconds && currentTime < skip.endSeconds
        )
    }

    const getReasonColor = (reason: string) => {
        switch (reason) {
            case 'filler_or_silence':
                return 'bg-yellow-100 text-yellow-800'
            case 'off_topic':
                return 'bg-red-100 text-red-800'
            case 'too_short':
                return 'bg-gray-100 text-gray-800'
            default:
                return 'bg-blue-100 text-blue-800'
        }
    }

    if (loading) return <div className="p-4">Loading...</div>
    if (error) return <div className="p-4 text-red-600">Error: {error}</div>

    const currentSkip = getCurrentSkipSegment()

    return (
        <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
            {currentSkip && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-sm font-medium text-yellow-800">
                        ⏭️ Skippable section detected ({currentSkip.reason?.replace(/_/g, ' ')})
                    </p>
                    <button
                        onClick={() => handleSkipSegment(currentSkip)}
                        className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                        Skip to {currentSkip.endTime}
                    </button>
                </div>
            )}

            <div>
                <h2 className="text-2xl font-bold mb-4">Skippable Sections ({skipMap.length})</h2>
                <div className="space-y-3">
                    {skipMap.map((skip, idx) => (
                        <div
                            key={idx}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleSkipSegment(skip)}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-lg">
                                            {skip.startTime} - {skip.endTime}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getReasonColor(skip.reason || '')}`}>
                                            {skip.reason?.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                    {skip.contentPreview && (
                                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                                            "{skip.contentPreview}"
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">
                                        Duration: {skip.durationSeconds.toFixed(1)}s
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleSkipSegment(skip)
                                    }}
                                    className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                >
                                    Jump
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Condensed Content ({segments.length})</h2>
                <div className="space-y-4">
                    {segments.map((seg, idx) => (
                        <div key={idx} className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-mono font-bold text-green-700">
                                        {seg.startTime} - {seg.endTime}
                                    </p>
                                    <p className="text-sm text-gray-600 capitalize mt-1">
                                        {seg.section}
                                    </p>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {seg.durationSeconds}s
                                </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-2">
                                {seg.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600">Total Skip Time</p>
                        <p className="font-bold text-lg">
                            {skipMap.reduce((sum, s) => sum + s.durationSeconds, 0).toFixed(0)}s
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-600">Condensed Content</p>
                        <p className="font-bold text-lg">
                            {segments.reduce((sum, s) => sum + s.durationSeconds, 0).toFixed(0)}s
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

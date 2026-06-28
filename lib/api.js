import axios from "axios"

const API_BASE_URL = "http://localhost:5000/api/lectures"

/**
 * Upload a YouTube video for processing
 */
export async function uploadLecture(videoUrl) {
    try {
        const response = await axios.post(API_BASE_URL, {
            videoUrl
        })
        return response.data
    } catch (error) {
        console.error("Error uploading lecture:", error)
        throw error
    }
}

/**
 * Get both condensed segments and skip map for a lecture
 */
export async function getLectureData(lectureId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/${lectureId}`)
        return response.data
    } catch (error) {
        console.error("Error fetching lecture data:", error)
        throw error
    }
}

/**
 * Get only the skip map for a lecture
 */
export async function getSkipMap(lectureId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/${lectureId}/skip-map`)
        return response.data.skipMap
    } catch (error) {
        console.error("Error fetching skip map:", error)
        throw error
    }
}

/**
 * Get only condensed segments for a lecture
 */
export async function getSegments(lectureId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/${lectureId}/segments`)
        return response.data.segments
    } catch (error) {
        console.error("Error fetching segments:", error)
        throw error
    }
}

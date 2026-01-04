export async function fetchExerciseVideo(query: string): Promise<string | null> {
    try {
        const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
        if (!apiKey) {
            console.warn("YouTube API Key is missing");
            return null;
        }

        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(
                query
            )}&key=${apiKey}`
        );

        if (!response.ok) {
            console.error("YouTube API error:", response.statusText);
            return null;
        }

        const data = await response.json();
        if (data.items && data.items.length > 0) {
            // Return the embed URL
            return `https://www.youtube.com/embed/${data.items[0].id.videoId}`;
        }

        return null;
    } catch (error) {
        console.error("Failed to fetch exercise video:", error);
        return null;
    }
}

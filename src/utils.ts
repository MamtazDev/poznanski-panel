export function formatDateToYYYYMMDD(dateString?: string): string {
  const date = dateString ? new Date(dateString) : new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateToMonthDayYear(dateString: string): string {
  const [year, month, day] = dateString.split("-");
  return `${new Date(`${year}-${month}-${day}`).toLocaleDateString("en-us", { month: "long", day: "numeric", year: "numeric" })}`;
}

type VideoInfo = {
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
};

const API_KEY = "AIzaSyBmYFEkoJIVhA4vD7hqWU3M7bf7djo-9rA";

export const getVideoInfoById = async (
  videoId: string
): Promise<VideoInfo | null> => {
  if (!videoId) {
    return null;
  }
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`
    );
    const data = await response.json();
    const videoInfo: VideoInfo = {
      title: data.items[0].snippet.title,
      description: data.items[0].snippet.description,
      thumbnail:
        data.items[0].snippet.thumbnails.maxres.url ||
        data.items[0].snippet.thumbnails.default.ur,
      tags: data.items[0].snippet.tags,
    };
    return videoInfo;
  } catch (error) {
    return null;
  }
};

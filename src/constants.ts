export interface Track {
  id: string;
  title: string;
  artist: string;
  prompt: string;
  duration: string;
  cover: string;
}

export const DUMMY_TRACKS: Track[] = [
  {
    id: "1",
    title: "Neon Pulse",
    artist: "Gemini AI",
    prompt: "A high-energy synthwave track with driving bass and neon aesthetic, 120bpm.",
    duration: "0:30",
    cover: "https://picsum.photos/seed/neon1/400/400",
  },
  {
    id: "2",
    title: "Cyber Drift",
    artist: "Gemini AI",
    prompt: "A dark, atmospheric cyberpunk techno track with industrial textures.",
    duration: "0:30",
    cover: "https://picsum.photos/seed/cyber/400/400",
  },
  {
    id: "3",
    title: "Midnight Lo-Fi",
    artist: "Gemini AI",
    prompt: "A chill, lo-fi hip hop beat with rainy night vibes and soft neon piano.",
    duration: "0:30",
    cover: "https://picsum.photos/seed/lofi/400/400",
  },
];

interface YouTubeEmbedProps {
  /** YouTube video ID (e.g. "dQw4w9WgXcQ") */
  id?: string;
  /** Full YouTube URL — id is derived automatically */
  url?: string;
  /** Accessible iframe title */
  title?: string;
  /** Start playback at this time in seconds */
  start?: number;
}

const YOUTUBE_ID_PATTERN = /^[\w-]{11}$/;

function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();

  if (YOUTUBE_ID_PATTERN.test(trimmed)) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1).split("/")[0];
      return YOUTUBE_ID_PATTERN.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const fromQuery = parsed.searchParams.get("v");
      if (fromQuery && YOUTUBE_ID_PATTERN.test(fromQuery)) {
        return fromQuery;
      }

      const embedMatch = parsed.pathname.match(/^\/embed\/([\w-]{11})/);
      if (embedMatch) {
        return embedMatch[1];
      }

      const shortsMatch = parsed.pathname.match(/^\/shorts\/([\w-]{11})/);
      if (shortsMatch) {
        return shortsMatch[1];
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function YouTube({ id, url, title = "YouTube video", start }: YouTubeEmbedProps) {
  const videoId = id ? extractYouTubeId(id) : url ? extractYouTubeId(url) : null;

  if (!videoId) {
    return (
      <p className="my-8 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        유효한 YouTube 동영상 ID 또는 URL을 제공해 주세요.
      </p>
    );
  }

  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
  });

  if (start !== undefined && start > 0) {
    params.set("start", String(Math.floor(start)));
  }

  const embedSrc = `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;

  return (
    <figure className="my-8 not-prose">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-muted shadow-sm">
        <iframe
          src={embedSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </figure>
  );
}

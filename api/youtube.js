export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const key = process.env.YOUTUBE_API_KEY;

  if (!key) {
    return res.status(500).json({ error: "YOUTUBE_API_KEY not set in Vercel environment variables" });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=TheAuthorRach&key=${key}`
    );
    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const stats = data?.items?.[0]?.statistics;
    if (!stats) {
      return res.status(404).json({ error: "Channel not found" });
    }

    return res.json({ subscribers: parseInt(stats.subscriberCount) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

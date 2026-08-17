import { promises as fs } from "node:fs";
import path from "node:path";
import { generateContent } from "../ai";
import { getVoiceProvider } from "./tts";
import { buildSrt, sentenceCues } from "./subtitles";
import { buildThumbnailSpec } from "./thumbnail";
import { renderVerticalVideo, burnSubtitles } from "./ffmpeg";

export async function produceShort(topic: string) {
  const content = await generateContent(topic);
  const voice = await getVoiceProvider().synthesize(content.script);
  const workDir = path.join(process.env.MEDIA_ROOT ?? path.join(process.cwd(), "storage"), "renders");
  await fs.mkdir(workDir, { recursive: true });
  const id = `${Date.now()}-${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30)}`;
  const srtPath = path.join(workDir, `${id}.srt`);
  await fs.writeFile(srtPath, buildSrt(sentenceCues(content.script)), "utf8");

  const thumbnail = buildThumbnailSpec(content.title, content.topic);
  const draftPath = path.join(workDir, `${id}-draft.mp4`);
  const finalPath = path.join(workDir, `${id}.mp4`);

  // The worker expects visual assets to be supplied by the visual provider.
  const visualPath = process.env.DEFAULT_VISUAL_PATH;
  if (!visualPath) {
    return { id, status: "WAITING_FOR_VISUAL_ASSET", content, voice, srtPath, thumbnail };
  }

  await renderVerticalVideo([{ imagePath: visualPath, duration: voice.durationSeconds ?? 8 }], draftPath);
  await burnSubtitles(draftPath, srtPath, finalPath);
  return { id, status: "READY", content, voice, srtPath, thumbnail, videoPath: finalPath };
}

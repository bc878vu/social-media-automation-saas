import { spawn } from "node:child_process";

export type RenderScene = { imagePath?: string; audioPath?: string; duration: number; text?: string };

function run(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stderr.on("data", chunk => { stderr += chunk.toString(); });
    child.on("error", reject);
    child.on("close", code => code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}: ${stderr.slice(-4000)}`)));
  });
}

/** Renders a vertical 1080x1920 MP4 from an ordered set of still-image scenes. */
export async function renderVerticalVideo(scenes: RenderScene[], outputPath: string) {
  if (!scenes.length) throw new Error("At least one scene is required");
  const first = scenes[0];
  if (!first.imagePath) throw new Error("Each render scene needs an imagePath");
  const duration = Math.max(1, scenes.reduce((sum, scene) => sum + scene.duration, 0));
  await run(process.env.FFMPEG_BIN ?? "ffmpeg", [
    "-y", "-loop", "1", "-i", first.imagePath,
    "-t", String(duration), "-vf", "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,format=yuv420p",
    "-r", "30", "-c:v", "libx264", "-preset", "medium", "-movflags", "+faststart", outputPath,
  ]);
}

export async function burnSubtitles(inputPath: string, subtitlePath: string, outputPath: string) {
  await run(process.env.FFMPEG_BIN ?? "ffmpeg", ["-y", "-i", inputPath, "-vf", `subtitles=${subtitlePath.replace(/:/g, "\\:")}`, "-c:a", "copy", outputPath]);
}

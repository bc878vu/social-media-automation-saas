import { spawn } from "node:child_process";

export type RenderInput = { imageSequence?: string[]; voicePath?: string; subtitlesPath?: string; outputPath: string; width?: number; height?: number; fps?: number };

export function renderVideo(input: RenderInput): Promise<void> {
  const width = input.width ?? 1080;
  const height = input.height ?? 1920;
  const fps = input.fps ?? 30;
  const args = ["-y", "-f", "lavfi", "-i", `color=c=black:s=${width}x${height}:r=${fps}`, "-t", "30", "-c:v", "libx264", "-pix_fmt", "yuv420p", input.outputPath];
  return new Promise((resolve, reject) => {
    const child = spawn(process.env.FFMPEG_BIN ?? "ffmpeg", args, { stdio: "ignore" });
    child.on("error", reject);
    child.on("exit", code => code === 0 ? resolve() : reject(new Error(`FFmpeg exited with code ${code}`)));
  });
}

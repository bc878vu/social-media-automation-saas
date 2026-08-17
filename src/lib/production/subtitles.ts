import type { ScriptPackage } from "./script";

export type SubtitleCue = { start: number; end: number; text: string };

export function createSubtitleCues(script: ScriptPackage): SubtitleCue[] {
  let cursor = 0;
  const cues: SubtitleCue[] = [];
  for (const scene of script.scenes) {
    cues.push({ start: cursor, end: cursor + scene.duration, text: scene.narration });
    cursor += scene.duration;
  }
  return cues;
}

export function toSrt(cues: SubtitleCue[]): string {
  const stamp = (seconds: number) => {
    const ms = Math.round((seconds % 1) * 1000);
    const whole = Math.floor(seconds);
    const h = Math.floor(whole / 3600);
    const m = Math.floor((whole % 3600) / 60);
    const s = whole % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
  };
  return cues.map((cue, i) => `${i + 1}\n${stamp(cue.start)} --> ${stamp(cue.end)}\n${cue.text}\n`).join("\n");
}

export type SubtitleCue = { start: number; end: number; text: string };

function timestamp(seconds: number) {
  const ms = Math.round((seconds % 1) * 1000);
  const total = Math.floor(seconds);
  const s = total % 60;
  const m = Math.floor(total / 60) % 60;
  const h = Math.floor(total / 3600);
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")},${String(ms).padStart(3,"0")}`;
}

export function buildSrt(cues: SubtitleCue[]) {
  return cues.map((cue, index) => `${index + 1}\n${timestamp(cue.start)} --> ${timestamp(cue.end)}\n${cue.text.trim()}\n`).join("\n");
}

export function sentenceCues(script: string, wordsPerSecond = 2.5): SubtitleCue[] {
  let cursor = 0;
  return script.split(/(?<=[.!?])\s+/).filter(Boolean).map(text => {
    const duration = Math.max(1, text.split(/\s+/).length / wordsPerSecond);
    const cue = { start: cursor, end: cursor + duration, text };
    cursor += duration;
    return cue;
  });
}

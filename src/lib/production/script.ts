import type { Trend } from "./trends";

export type ScriptPackage = {
  hook: string;
  scenes: Array<{ index: number; narration: string; visual: string; duration: number }>;
  cta: string;
};

export function createScript(trend: Trend): ScriptPackage {
  const subject = trend.topic;
  return {
    hook: `Stop scrolling: here is what you need to know about ${subject}.`,
    scenes: [
      { index: 1, narration: `First, understand the shift. ${subject} is changing how people create and work.`, visual: "Fast title card with topic and kinetic text", duration: 6 },
      { index: 2, narration: `Second, focus on the practical impact. Pick one task you can automate today and measure the time saved.`, visual: "Clean workflow animation with three steps", duration: 8 },
      { index: 3, narration: `Third, keep a human review step for accuracy, brand safety and originality. Automation should increase output without removing judgment.`, visual: "Creator reviewing a content checklist", duration: 9 },
      { index: 4, narration: trend.angle + ".", visual: "Three numbered takeaways with subtle motion", duration: 7 },
    ],
    cta: "Follow for more practical automation ideas and save this for your next content session.",
  };
}

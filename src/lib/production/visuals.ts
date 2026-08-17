import type { ScriptPackage } from "./script";

export type VisualPlan = { scene: number; prompt: string; duration: number; assetType: "generated" | "licensed" | "text" };

export function buildVisualPlan(script: ScriptPackage): VisualPlan[] {
  return script.scenes.map(scene => ({
    scene: scene.index,
    prompt: `Vertical social video visual: ${scene.visual}. Topic context: ${scene.narration.slice(0, 140)}`,
    duration: scene.duration,
    assetType: scene.index === 1 ? "text" : "generated",
  }));
}

import type { ScriptPackage } from "./script";

export type VoiceAsset = { provider: "mock" | "elevenlabs" | "openai"; filePath: string; duration: number };

export async function synthesizeVoice(script: ScriptPackage, outputDir = "./storage/audio"): Promise<VoiceAsset> {
  // Production adapter boundary: connect an approved TTS provider here.
  // We intentionally do not embed provider credentials in the repository.
  const duration = script.scenes.reduce((sum, scene) => sum + scene.duration, 0);
  return { provider: "mock", filePath: `${outputDir}/pending-voice.mp3`, duration };
}

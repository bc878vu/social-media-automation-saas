export type VoiceResult = { provider: string; audioPath?: string; durationSeconds?: number };

export interface VoiceProvider {
  synthesize(text: string, options?: { voice?: string; language?: string }): Promise<VoiceResult>;
}

/** Development provider. Production providers should implement the same contract and return a stored audio asset. */
export class MockVoiceProvider implements VoiceProvider {
  async synthesize(text: string): Promise<VoiceResult> {
    return { provider: "mock", durationSeconds: Math.max(2, Math.ceil(text.split(/\s+/).length / 2.5)) };
  }
}

export function getVoiceProvider(): VoiceProvider {
  return new MockVoiceProvider();
}

export async function synthesizeVoice(text: string) {
  if (process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID) {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`, { method: "POST", headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY, "Content-Type": "application/json", Accept: "audio/mpeg" }, body: JSON.stringify({ text, model_id: process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2" }) });
    if (!response.ok) throw new Error(`TTS provider failed: ${response.status}`);
    return { buffer: Buffer.from(await response.arrayBuffer()), mimeType: "audio/mpeg", provider: "elevenlabs" };
  }
  return { buffer: Buffer.from([]), mimeType: "audio/mpeg", provider: "mock" };
}

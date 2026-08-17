export type AIResult = { text: string; provider: string };

export async function aiGenerate(prompt: string): Promise<AIResult> {
  if (process.env.OPENAI_API_KEY) {
    const response = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-5-mini", input: prompt }) });
    if (!response.ok) throw new Error(`AI provider failed: ${response.status}`);
    const data = await response.json();
    const text = data.output?.flatMap((x: any) => x.content || []).map((x: any) => x.text || "").join("\n") || "";
    return { text, provider: "openai" };
  }
  return { text: "", provider: "mock" };
}

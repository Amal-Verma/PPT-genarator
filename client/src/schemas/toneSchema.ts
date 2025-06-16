// Tone schema for presentation generation

export type ToneOption = {
  key: string;
  label: string;
  prompt: string;
};

export const toneOptions: ToneOption[] = [
  {
    key: "professional",
    label: "Professional",
    prompt: "Use a formal, business-like tone suitable for corporate presentations."
  },
  {
    key: "friendly",
    label: "Friendly",
    prompt: "Use a warm, approachable, and conversational tone."
  },
  {
    key: "inspirational",
    label: "Inspirational",
    prompt: "Use a motivating and uplifting tone to inspire the audience."
  },
  {
    key: "academic",
    label: "Academic",
    prompt: "Use a scholarly, objective, and precise tone suitable for educational settings."
  },
  {
    key: "concise",
    label: "Concise",
    prompt: "Be brief and to the point, avoiding unnecessary elaboration."
  }
];

export function getTonePrompt(toneKey: string): string {
  const tone = toneOptions.find(t => t.key === toneKey);
  return tone ? tone.prompt : toneOptions[0].prompt;
}

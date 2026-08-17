export type Platform = "YOUTUBE" | "INSTAGRAM" | "FACEBOOK";
export type ContentStatus = "IDEA" | "SCRIPTED" | "PRODUCING" | "READY" | "SCHEDULED" | "PUBLISHED" | "FAILED";

export type AutomationInput = {
  niche: string;
  postsPerDay: number;
  frequency: string;
  platforms: Platform[];
  autoApprove?: boolean;
};

export type GeneratedContent = {
  title: string;
  topic: string;
  script: string;
  caption: string;
  hashtags: string[];
};

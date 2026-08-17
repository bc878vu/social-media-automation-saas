import type { Platform } from "./types";

export interface PublishPayload {
  title: string;
  caption: string;
  videoUrl?: string;
  scheduledAt?: Date;
}

export interface PublishResult {
  externalId: string;
  url: string;
  platform: Platform;
}

export interface PlatformAdapter {
  platform: Platform;
  publish(payload: PublishPayload): Promise<PublishResult>;
}

class MockAdapter implements PlatformAdapter {
  constructor(public platform: Platform) {}
  async publish(payload: PublishPayload): Promise<PublishResult> {
    const id = `${this.platform.toLowerCase()}_${Date.now()}`;
    return { externalId: id, url: `https://example.com/${id}`, platform: this.platform };
  }
}

export const adapters: Record<Platform, PlatformAdapter> = {
  YOUTUBE: new MockAdapter("YOUTUBE"),
  INSTAGRAM: new MockAdapter("INSTAGRAM"),
  FACEBOOK: new MockAdapter("FACEBOOK"),
};

export async function publishTo(platform: Platform, payload: PublishPayload) {
  return adapters[platform].publish(payload);
}

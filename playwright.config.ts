import { defineConfig } from "@playwright/test"
import { devices as replayDevices, replayReporter } from "@replayio/playwright"

const replayApiKey =
  process.env.REPLAY_API_KEY || process.env.RECORD_REPLAY_API_KEY

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    replayReporter({
      apiKey: replayApiKey,
      upload: Boolean(replayApiKey),
    }),
    ["line"],
  ],
  use: {
    baseURL: "http://localhost:4321",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
    {
      name: "replay-chromium",
      use: { ...replayDevices["Replay Chromium"] },
    },
  ],
})

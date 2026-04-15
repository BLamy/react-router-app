import { defineConfig } from "@playwright/test"
import { devices as replayDevices } from "@replayio/playwright"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
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

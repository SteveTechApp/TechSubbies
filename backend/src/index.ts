import { createApp } from "./app.js";
import { validateRuntimeConfig } from "./lib/config.js";
import { startCertificateExpiryReminderScheduler } from "./lib/certificateNotifications.js";

const PORT = Number(process.env.PORT) || 4000;

validateRuntimeConfig();
const app = createApp();
startCertificateExpiryReminderScheduler();

app.listen(PORT, () => {
  console.log(`TechSubbies backend listening on http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.log("Note: GEMINI_API_KEY is not set - AI endpoints will return a clear 'not configured' error.");
  }
});

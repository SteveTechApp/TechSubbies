import { createApp } from "./app.js";
import { db } from "./lib/db.js";
import { log } from "./lib/logger.js";

const PORT = Number(process.env.PORT) || 4000;

if (process.env.NODE_ENV === "production" && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.startsWith("replace-"))) {
  throw new Error("Production JWT_SECRET must contain at least 32 non-placeholder characters.");
}
if(process.env.NODE_ENV==="production"&&process.env.REQUIRE_EXTERNAL_SERVICES==="true"){const required=["STRIPE_SECRET_KEY","STRIPE_WEBHOOK_SECRET","STRIPE_PRICE_PROFESSIONAL","STRIPE_PRICE_SKILLS","STRIPE_PRICE_BUSINESS","SMTP_HOST","EMAIL_FROM","ACCOUNT_ACTION_URL"];const missing=required.filter(key=>!process.env[key]);if(missing.length)throw new Error(`Missing required production configuration: ${missing.join(", ")}`);}

const app = createApp();

const server = app.listen(PORT, () => {
  log("info","service.started",{port:PORT,environment:process.env.NODE_ENV||"development"});
  if (!process.env.GEMINI_API_KEY) {
    log("warn","service.optional-ai-disabled");
  }
});

function shutdown(signal: string) {
  log("info","service.shutdown",{signal});
  server.close((error) => { if (error) { log("error","service.shutdown-failed",{message:error.message}); process.exit(1); } db.close(); process.exit(0); });
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

import { SettingsStorage } from "../../core/src/storage.js";
import { env } from "./env.js";
import { initMessageHandlers } from "./messageHandler/initMessageHandlers.js";

export const storage = new SettingsStorage(env.baseUrl, env.id);

storage.fetchSettings();

initMessageHandlers();

console.log("Hello from service-worker/ts/index.ts");

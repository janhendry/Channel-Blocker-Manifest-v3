import { SettingsStorage } from "./SettingsStorage";
import { env } from "./env";

export * from "./type/enums";
export * from "./type/Settings";
export * from "./type/Messages";
export * from "./type/Tap";

export * from "./util";
export * from "./Client";

export const storage = new SettingsStorage(env.baseUrl, env.id);

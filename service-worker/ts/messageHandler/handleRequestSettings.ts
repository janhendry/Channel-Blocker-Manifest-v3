import type { Settings, UiSettings } from "../../../core/src/index";
import type { RequestSettingsMessage } from "../../../core/src/type/Messages";
import { storage } from "../index";

/**
 * Returns the settings.
 * @param message The RequestSettingsMessage.
 * @returns The settings.
 */
export function handleRequestSettings(
	message: RequestSettingsMessage,
): Settings {
	return storage.settings;
}

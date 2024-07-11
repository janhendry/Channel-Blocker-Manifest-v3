import { type RequestSettingsMessage, type Settings, storage } from "core";

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

import {
	type RequestSettingsMessage,
	type SettingsDTO,
	mapSettingsToDTO,
	storage,
} from "core";

/**
 * Returns the settings.
 * @param message The RequestSettingsMessage.
 * @returns The settings.
 */
export function handleRequestSettings(
	message: RequestSettingsMessage,
): SettingsDTO {
	return mapSettingsToDTO(storage.settings);
}

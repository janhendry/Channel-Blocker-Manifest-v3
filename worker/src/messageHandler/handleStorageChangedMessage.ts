import { type StorageChangedMessage, storage } from "core";

import { sendSettingsChangedMessage } from "../sendMessage/sendSettingsChangedMessage";
import { sendStorageChangedMessage } from "../sendMessage/sendStorageChangedMessage";

/**
 * Reloads the storage and settings and sends a storage changed message to all tabs running YouTube.
 * @param message The StorageChangedMessage.
 */
export async function handleStorageChangedMessage(
	message: StorageChangedMessage,
) {
	await storage.fetchSettings();

	// !Fixme: Why 2 messages
	sendStorageChangedMessage();
	sendSettingsChangedMessage();
}

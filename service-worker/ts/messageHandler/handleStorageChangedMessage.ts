import type { StorageChangedMessage } from "../../../core/src/type/Messages";
import { storage } from "../index";
import { sendSettingsChangedMessage } from "../message.ts/sendSettingsChangedMessage";
import { sendStorageChangedMessage } from "../message.ts/sendStorageChangedMessage";

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

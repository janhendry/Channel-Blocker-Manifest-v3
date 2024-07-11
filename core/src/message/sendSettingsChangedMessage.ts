import { CommunicationRole, MessageType, log, storage } from "../index";
import type { SettingsChangedMessage } from "../type/Messages";

/**
 * Sends a settings changed message to all tabs that have YouTube open.
 * If is gets a settings changed message it changes the receiver to CONTENT_SCRIPT.
 * @param message The settings changed message.
 */
export async function sendSettingsChangedMessage(
	message: SettingsChangedMessage,
) {
	chrome.tabs.query({ url: "*://www.youtube.com/*" }, (tabs) => {
		for (let index = 0; index < tabs.length; index++) {
			const tab = tabs[index];
			if (tab.id !== undefined) {
				log("Send", `SettingsChangedMessage to tab ${tab.id}`);

				chrome.tabs.sendMessage(tab.id, message);
			}
		}
	});
}

// sender: CommunicationRole.SETTINGS,
// receiver: CommunicationRole.CONTENT_SCRIPT,
// type: MessageType.SETTINGS_CHANGED,
// content: storage.settings,

import { CommunicationRole, MessageType, log } from "../index";
import type { StorageChangedMessage } from "../type/Messages";
import { getConfigTabs } from "./helper";

/**
 * Sends a storage changed message to all tabs that have YouTube open and the config tab if an tab id is available.
 */
export async function sendStorageChangedMessage() {
	const storageChangedMessage: StorageChangedMessage = {
		sender: CommunicationRole.SERVICE_WORKER,
		receiver: CommunicationRole.CONTENT_SCRIPT,
		type: MessageType.STORAGE_CHANGED,
	};

	chrome.tabs.query({ url: "*://www.youtube.com/*" }, (tabs) => {
		for (let index = 0; index < tabs.length; index++) {
			const tab = tabs[index];
			if (tab.id !== undefined) {
				log("Send", "Sending StorageChangedMessage to tab", tab.id);
				chrome.tabs.sendMessage(tab.id, storageChangedMessage);
			}
		}
	});

	const configTabs = await getConfigTabs();
	for (let index = 0; index < configTabs.length; index++) {
		const tab = configTabs[index];
		const storageChangedMessageForSettings = {
			sender: CommunicationRole.SERVICE_WORKER,
			receiver: CommunicationRole.SETTINGS,
			type: MessageType.STORAGE_CHANGED,
			content: undefined,
		};
		log("Send", "Sending StorageChangedMessage to config tab", tab.id);
		chrome.tabs.sendMessage(tab.id, storageChangedMessageForSettings);
	}
}

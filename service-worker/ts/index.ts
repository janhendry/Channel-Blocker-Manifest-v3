import { CbSettingsClient } from "./CbSettingsClient.js";
import { CommunicationRole, MessageType } from "./enums.js";
import { env } from "./env.js";
import { getConfigTabs } from "./helper.js";
import type { Message } from "./interfaces/interfaces.js";
import {
	handleAddBlockingRuleMessage,
	handleIsBlockedMessage,
	handleRemoveBlockingRuleMessage,
	handleRequestSettings,
	handleStorageChangedMessage,
	loadDataFromStorage,
	loadDataIfNecessary,
	sendSettingsChangedMessage,
} from "./storage.js";

export const cbSettingsClient = new CbSettingsClient(env.baseUrl);

loadDataFromStorage();
initListeners();

/**
 * Adds a message listener and a browser cation listener.
 */
function initListeners() {
	chrome.runtime.onMessage.addListener(
		async (
			message: Message,
			sender: chrome.runtime.MessageSender,
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			sendResponse: (response?: any) => void,
		) => {
			if (message.receiver !== CommunicationRole.SERVICE_WORKER) return;

			loadDataIfNecessary();

			switch (message.type) {
				case MessageType.ADD_BLOCKING_RULE:
					handleAddBlockingRuleMessage(message);
					break;
				case MessageType.REMOVE_BLOCKING_RULE:
					handleRemoveBlockingRuleMessage(message);
					break;
				case MessageType.IS_BLOCKED:
					sendResponse(handleIsBlockedMessage(message));
					break;
				case MessageType.SETTINGS_CHANGED:
					sendSettingsChangedMessage(message);
					break;
				case MessageType.REQUEST_SETTINGS:
					sendResponse(handleRequestSettings(message));
					break;
				case MessageType.STORAGE_CHANGED:
					handleStorageChangedMessage(message);
					break;

				default:
					break;
			}
		},
	);

	//open config page as default behavior of clicking the browserAction-button
	chrome.action.onClicked.addListener(openConfig);
}

//if an open config page exists makes config tab active, otherwise creates new config tab and make it active
async function openConfig() {
	const configTabs = await getConfigTabs();
	if (configTabs.length > 0) {
		const tab = configTabs[0];
		await chrome.tabs.update(tab.id, {
			active: true,
		});

		chrome.windows.update(tab.windowId, {
			focused: true,
		});
	} else {
		chrome.tabs.create({
			active: true,
			url: "./ui/settings/index.html",
		});
	}
}

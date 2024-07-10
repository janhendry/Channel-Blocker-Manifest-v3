import { CommunicationRole, MessageType } from "../../../core/src/index";
import type { Message } from "../../../core/src/type/Messages";
import { getConfigTabs } from "../helper";
import { storage } from "../index";
import { sendSettingsChangedMessage } from "../message.ts/sendSettingsChangedMessage";
import { handleAddBlockingRuleMessage } from "./handleAddBlockingRuleMessage";
import { handleIsBlockedMessage } from "./handleIsBlockedMessage";
import { handleRemoveBlockingRuleMessage } from "./handleRemoveBlockingRuleMessage";
import { handleRequestSettings } from "./handleRequestSettings";
import { handleStorageChangedMessage } from "./handleStorageChangedMessage";

/**
 * Adds a message listener and a browser cation listener.
 */
export function initMessageHandlers() {
	chrome.runtime.onMessage.addListener(
		async (
			message: Message,
			sender: chrome.runtime.MessageSender,
			// !FIXME: Type 'any' is used here. This should be fixed in the future.
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			sendResponse: (response?: any) => void,
		) => {
			if (message.receiver !== CommunicationRole.SERVICE_WORKER) return;

			storage.fetchSettings();

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

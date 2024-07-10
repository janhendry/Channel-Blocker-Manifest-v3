import {
	CommunicationRole,
	MessageType,
	SettingsState,
} from "../../../core/src/index.js";
import { SettingsStorage } from "../../../core/src/storage.js";
import type {
	AddBlockingRuleMessage,
	Message,
	RemoveBlockingRuleMessage,
} from "../../../core/src/type/Messages.js";
import { UI } from "./UI/UI.js";
import { initUI } from "./UI/initUI.js";
import { updateUI } from "./UI/updateUI.js";
import { env } from "./env.js";

export let settingsState: SettingsState = SettingsState.BLOCKED_CHANNELS;

const storage = new SettingsStorage(env.baseUrl, env.id);

initUI();
updateDataAndUI();

async function updateDataAndUI() {
	await storage.fetchSettings();
	setSettingsState(SettingsState.BLOCKED_CHANNELS);
	updateUI();
}

export function setSettingsState(pSettingsState: SettingsState) {
	settingsState = pSettingsState;
	UI.blockedChannelsRemoveBtn.classList.add("outlined");
}

chrome.runtime.onMessage.addListener(
	(message: Message, sender: chrome.runtime.MessageSender) => {
		if (message.receiver !== CommunicationRole.SETTINGS) return;

		switch (message.type) {
			case MessageType.STORAGE_CHANGED:
				updateDataAndUI();
				break;

			default:
				break;
		}
	},
);

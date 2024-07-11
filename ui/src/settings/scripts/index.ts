import {
	CommunicationRole,
	type Message,
	MessageType,
	SettingsState,
	log,
	storage,
} from "core";
import { UI } from "./UI/UI.js";
import { initUI } from "./UI/initUI.js";
import { updateUI } from "./UI/updateUI.js";

export let settingsState: SettingsState = SettingsState.BLOCKED_CHANNELS;

chrome.runtime.onMessage.addListener(
	(message: Message, sender: chrome.runtime.MessageSender) => {
		log("Receive", `Conftig tab received message from ${sender.url}`, message);
		// if (message.receiver !== CommunicationRole.SETTINGS) return;

		switch (message.type) {
			case MessageType.STORAGE_CHANGED:
				updateDataAndUI();
				break;

			default:
				break;
		}
	},
);

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

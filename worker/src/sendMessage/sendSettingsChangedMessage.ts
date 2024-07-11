import {
	CommunicationRole,
	MessageType,
	type SettingsChangedMessage,
	mapSettingsToDTO,
	storage,
} from "core";

/**
 * Sends a settings changed message to all tabs that have YouTube open.
 * If is gets a settings changed message it changes the receiver to CONTENT_SCRIPT.
 * @param message The settings changed message.
 */
export async function sendSettingsChangedMessage(
	message: SettingsChangedMessage = {
		sender: CommunicationRole.SETTINGS,
		receiver: CommunicationRole.CONTENT_SCRIPT,
		type: MessageType.SETTINGS_CHANGED,
		content: mapSettingsToDTO(storage.settings),
	},
) {
	message.receiver = CommunicationRole.CONTENT_SCRIPT;

	// !FIXME: Bug or feature. Old code set only the content of the message to the settings.ui.
	storage.settings.ui = {
		...storage.settings.ui,
		...message.content,
	};

	chrome.tabs.query({ url: "*://www.youtube.com/*" }, (tabs) => {
		for (let index = 0; index < tabs.length; index++) {
			const tab = tabs[index];
			if (tab.id !== undefined) chrome.tabs.sendMessage(tab.id, message);
		}
	});
}

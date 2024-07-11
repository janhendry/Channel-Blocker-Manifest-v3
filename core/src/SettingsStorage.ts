import { CbClient } from "./Client.js";
import { sendSettingsChangedMessage } from "./message/sendSettingsChangedMessage.js";
import { sendStorageChangedMessage } from "./message/sendStorageChangedMessage.js";
import type { Settings, SettingsDTO } from "./type/Settings.js";
import { mapDTOtoRules, mapDTOtoSettings, mapRulesToDTO } from "./util.js";

const defaultSettings: Settings = {
	ui: {
		design: 0,
		advancedView: false,
		openPopup: false,
		buttonVisible: true,
		buttonColor: "#717171",
		buttonSize: 142,
		animationSpeed: 200,
	},
	rules: {
		blockedChannels: new Set(),
		excludedChannels: new Set(),
		blockedChannelsRegExp: {},
		blockedComments: {},
		blockedVideoTitles: {},
	},
};

const STORAGE_VERSION = "1.0";
export class SettingsStorage {
	private id: string;
	private cbClient: CbClient;
	private storageVersion: string | undefined;
	public settings: Settings;

	constructor(baseUrl: string, id: string) {
		this.cbClient = new CbClient(baseUrl);
		this.storageVersion = undefined;
		this.settings = defaultSettings;
		this.id = id;
	}

	/**
	 * Fetch the settings from the server and local storage.
	 */
	public async fetchSettings() {
		console.debug("Fetching settings from server and local storage");

		const rules = await this.cbClient.fetchSettings(this.id);
		const storageSettings = (await chrome.storage.local.get()) as Settings;

		this.settings = mapDTOtoSettings({
			rules,
			ui: storageSettings.ui,
		});

		// !FIXME: Why send 2 messages?
		sendStorageChangedMessage();
		sendSettingsChangedMessage();
	}

	/**
	 * Push the settings to the server and local storage.
	 */
	public async pushSettings(): Promise<void> {
		await chrome.storage.local.set(this.settings);
		this.cbClient.updateSettings(mapRulesToDTO(this.settings.rules), this.id);
	}

	/**
	 * Reset the settings to the default values.
	 */
	public async resetSettings() {
		this.settings = defaultSettings;
		await this.pushSettings();
	}

	public setSettings(settings: SettingsDTO) {
		this.settings = {
			ui: this.settings.ui,
			rules: mapDTOtoRules(settings.rules),
		};
	}
}

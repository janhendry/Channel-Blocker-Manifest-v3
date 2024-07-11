import { CbClient } from "./Client.js";
import { storage } from "./index.js";
import { sendSettingsChangedMessage } from "./message/sendSettingsChangedMessage.js";
import { sendStorageChangedMessage } from "./message/sendStorageChangedMessage.js";
import type { Settings, SettingsDTO } from "./type/Settings.js";
import { CommunicationRole, MessageType } from "./type/enums.js";

import {
	mapDTOtoRules,
	mapDTOtoSettings,
	mapRulesToDTO,
	mapSettingsToDTO,
} from "./util.js";

const STORAGE_VERSION = "1.0";

const defaultSettings: Settings = {
	storageVersion: STORAGE_VERSION,
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
		// const rules = await this.cbClient.fetchSettings(this.id);
		const storageSettings = (await chrome.storage.local.get()) as SettingsDTO;

		try {
			this.settings = mapDTOtoSettings(storageSettings);
		} catch (e) {
			console.error("Failed to load settings from storage", e);
			chrome.storage.local.clear();
			chrome.storage.local.set(mapSettingsToDTO(defaultSettings));
			this.settings = defaultSettings;
		}

		// !FIXME: Why send 2 messages? // Fix Roles
		sendStorageChangedMessage();
		sendSettingsChangedMessage({
			sender: CommunicationRole.SETTINGS,
			receiver: CommunicationRole.CONTENT_SCRIPT,
			type: MessageType.SETTINGS_CHANGED,
			content: mapSettingsToDTO(storage.settings),
		});
	}

	/**
	 * Push the settings to the server and local storage.
	 */
	public async pushSettings(): Promise<void> {
		await chrome.storage.local.set(mapSettingsToDTO(this.settings));
		// this.cbClient.updateSettings(mapRulesToDTO(this.settings.rules), this.id);
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
			...this.settings,
			rules: mapDTOtoRules(settings.rules),
		};
	}
}

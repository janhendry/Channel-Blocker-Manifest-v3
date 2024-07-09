export enum MessageType {
	ADD_BLOCKING_RULE = 0,
	REMOVE_BLOCKING_RULE = 1,
	IS_BLOCKED = 2,
	STORAGE_CHANGED = 3,
	REQUEST_SETTINGS = 4,
	SETTINGS_CHANGED = 5,
}

export enum CommunicationRole {
	SERVICE_WORKER = 0,
	CONTENT_SCRIPT = 1,
	SETTINGS = 2,
}

export enum SettingsDesign {
	DETECT = 0,
	DARK = 1,
	LICHT = 2,
}

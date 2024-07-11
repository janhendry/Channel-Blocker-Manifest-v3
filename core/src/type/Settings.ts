import type { SettingsDesign } from "./enums";

export type Settings = {
	storageVersion: string;
	rules: Rules;
	ui: UiSettings;
};

export type SettingsDTO = {
	storageVersion: string;
	rules: RulesDTO;
	ui: UiSettings;
};

export type Rules = {
	blockedChannels: Set<string>;
	excludedChannels: Set<string>;

	blockedVideoTitles: Record<string, string>;
	blockedChannelsRegExp: Record<string, string>;
	blockedComments: Record<string, string>;
};

export type RulesDTO = {
	blockedChannels: string[];
	excludedChannels: string[];

	blockedVideoTitles: Record<string, string>;
	blockedChannelsRegExp: Record<string, string>;
	blockedComments: Record<string, string>;
};

export type UiSettings = {
	design: SettingsDesign;
	advancedView: boolean;
	openPopup: boolean;
	buttonVisible: boolean;
	buttonColor: string;
	buttonSize: number;
	animationSpeed: number;
};

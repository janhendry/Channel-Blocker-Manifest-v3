import {
	CommunicationRole,
	MessageType,
	SettingsState,
} from "../../../../core/src/index";
import type {
	AddBlockingRuleMessage,
	Message,
	RemoveBlockingRuleMessage,
} from "../../../../core/src/type/Messages";
import { storage } from "../../../../service-worker/ts/index";
import { settingsState } from "../index";
import { UI } from "./UI";
import { updateRulesUI } from "./updateRulesUI";

export function updateUI() {
	UI.nav.classList.remove("open");
	const showRulesSection =
		settingsState === SettingsState.BLOCKED_CHANNELS ||
		settingsState === SettingsState.BLOCKED_TITLES ||
		settingsState === SettingsState.BLOCKED_NAMES ||
		settingsState === SettingsState.BLOCKED_COMMENTS ||
		settingsState === SettingsState.EXCLUDED_CHANNELS;

	UI.rulesSection.style.display = showRulesSection ? "" : "none";
	UI.blockedChannelsNav.classList.remove("active");
	UI.blockedTitlesNav.classList.remove("active");
	UI.blockedNamesNav.classList.remove("active");
	UI.blockedCommentsNav.classList.remove("active");
	UI.excludedChannelsNav.classList.remove("active");
	if (showRulesSection) {
		updateRulesUI();
	}

	const showAppearanceSection = settingsState === SettingsState.APPEARANCE;
	UI.appearanceSection.style.display = showAppearanceSection ? "" : "none";
	UI.appearanceNav.classList.toggle("active", showAppearanceSection);

	const showImportExportSection = settingsState === SettingsState.IMPORT_EXPORT;
	UI.importExportSection.style.display = showImportExportSection ? "" : "none";
	UI.importExportNav.classList.toggle("active", showImportExportSection);

	const showAboutSection = settingsState === SettingsState.ABOUT;
	UI.aboutSection.style.display = showAboutSection ? "" : "none";
	UI.aboutNav.classList.toggle("active", showAboutSection);

	const showFaqSection = settingsState === SettingsState.FAQ;
	UI.faqSection.style.display = showFaqSection ? "" : "none";
	UI.faqNav.classList.toggle("active", showFaqSection);
}

export function addNewRule() {
	const rule = UI.blockedChannelsInput.value;
	if (rule.trim().length === 0) return;

	const message: AddBlockingRuleMessage = {
		sender: CommunicationRole.SETTINGS,
		receiver: CommunicationRole.SERVICE_WORKER,
		type: MessageType.ADD_BLOCKING_RULE,
		content: {
			blockedChannel:
				settingsState === SettingsState.BLOCKED_CHANNELS ? rule : undefined,
			blockingVideoTitleRegExp:
				settingsState === SettingsState.BLOCKED_TITLES ? rule : undefined,
			blockingChannelRegExp:
				settingsState === SettingsState.BLOCKED_NAMES ? rule : undefined,
			blockingCommentRegExp:
				settingsState === SettingsState.BLOCKED_COMMENTS ? rule : undefined,
			excludedChannel:
				settingsState === SettingsState.EXCLUDED_CHANNELS ? rule : undefined,
			caseInsensitive: UI.caseInsensitiveCheckbox.checked,
		},
	};
	chrome.runtime.sendMessage(message);
	UI.blockedChannelsInput.value = "";
}

export function removeRule() {
	const selectedOptions = [];
	for (
		let index = 0;
		index < UI.blockedChannelsSelect.options.length;
		index++
	) {
		const option = UI.blockedChannelsSelect.options[index];
		if (option.selected) selectedOptions.push(option.value);
	}
	const message: RemoveBlockingRuleMessage = {
		sender: CommunicationRole.SETTINGS,
		receiver: CommunicationRole.SERVICE_WORKER,
		type: MessageType.REMOVE_BLOCKING_RULE,
		content: {
			blockedChannel:
				settingsState === SettingsState.BLOCKED_CHANNELS
					? selectedOptions
					: undefined,
			blockingVideoTitleRegExp:
				settingsState === SettingsState.BLOCKED_TITLES
					? selectedOptions
					: undefined,
			blockingChannelRegExp:
				settingsState === SettingsState.BLOCKED_NAMES
					? selectedOptions
					: undefined,
			blockingCommentRegExp:
				settingsState === SettingsState.BLOCKED_COMMENTS
					? selectedOptions
					: undefined,
			excludedChannel:
				settingsState === SettingsState.EXCLUDED_CHANNELS
					? selectedOptions
					: undefined,
		},
	};
	chrome.runtime.sendMessage(message);
}

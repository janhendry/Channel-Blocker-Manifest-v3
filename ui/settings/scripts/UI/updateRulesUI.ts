import { SettingsState } from "../../../../core/src/index";
import { storage } from "../../../../service-worker/ts/index";
import { settingsState } from "../index";
import { UI } from "./UI";

export function updateRulesUI() {
	const filter = storage.settings.rules;

	while (UI.blockedChannelsSelect.firstChild !== null) {
		UI.blockedChannelsSelect.removeChild(UI.blockedChannelsSelect.firstChild);
	}

	switch (settingsState) {
		case SettingsState.BLOCKED_CHANNELS:
			UI.blockedChannelsNav.classList.add("active");
			UI.caseInsensitiveRow.style.display = "none";
			UI.headingElement.innerText = "Blocked Users/Channels";
			UI.blockedChannelsInput.placeholder = "User/Channel Name";
			for (const channelName of filter.blockedChannels) {
				insertOption(channelName);
			}
			break;
		case SettingsState.BLOCKED_TITLES:
			UI.blockedTitlesNav.classList.add("active");
			UI.caseInsensitiveRow.style.display = "";
			UI.headingElement.innerText =
				"Blocked Video Titles by Regular Expressions";
			UI.blockedChannelsInput.placeholder = "Video Title Regular Expression";
			for (const key in filter.blockedVideoTitles) {
				if (
					Object.prototype.hasOwnProperty.call(filter.blockedVideoTitles, key)
				) {
					insertOption(key, filter.blockedVideoTitles[key] !== "");
				}
			}
			break;
		case SettingsState.BLOCKED_NAMES:
			UI.blockedNamesNav.classList.add("active");
			UI.caseInsensitiveRow.style.display = "";
			UI.headingElement.innerText =
				"Blocked User/Channel Names by Regular Expressions";
			UI.blockedChannelsInput.placeholder =
				"User/Channel Name Regular Expression";
			for (const key in filter.blockedChannelsRegExp) {
				if (
					Object.prototype.hasOwnProperty.call(
						filter.blockedChannelsRegExp,
						key,
					)
				) {
					insertOption(key, filter.blockedChannelsRegExp[key] !== "");
				}
			}
			break;
		case SettingsState.BLOCKED_COMMENTS:
			UI.blockedCommentsNav.classList.add("active");
			UI.caseInsensitiveRow.style.display = "";
			UI.headingElement.innerText = "Blocked Comments by Regular Expressions";
			UI.blockedChannelsInput.placeholder = "Comment Regular Expression";
			for (const key in filter.blockedComments) {
				if (Object.prototype.hasOwnProperty.call(filter.blockedComments, key)) {
					insertOption(key, filter.blockedComments[key] !== "");
				}
			}
			break;
		case SettingsState.EXCLUDED_CHANNELS:
			UI.excludedChannelsNav.classList.add("active");
			UI.caseInsensitiveRow.style.display = "none";
			UI.headingElement.innerText =
				"Excluded Users/Channels from Regular Expressions";
			UI.blockedChannelsInput.placeholder = "User/Channel Name";
			for (const channelName of filter.excludedChannels) {
				insertOption(channelName);
			}
			break;
	}

	UI.blockedChannelsSelect.classList.toggle(
		"larger",
		UI.blockedChannelsSelect.childElementCount > 4,
	);
	UI.blockedChannelsSelect.classList.toggle(
		"largest",
		UI.blockedChannelsSelect.childElementCount > 8,
	);
}

function insertOption(value: string, isCaseInsensitive = false) {
	const option = document.createElement("option");
	option.value = value;
	option.innerText = value;
	option.classList.toggle("case-insensitive", isCaseInsensitive);
	UI.blockedChannelsSelect.insertAdjacentElement("afterbegin", option);
}

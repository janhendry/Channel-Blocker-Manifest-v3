import { SettingsState } from "core";
import { initImportExport } from "../importExport";
import { setSettingsState } from "../index";
import { initNavigation } from "../navigation";
import { initAppearanceUI } from "../settings";
import { UI } from "./UI";
import { initDonation } from "./donate";
import { initFaq } from "./faq";
import { addNewRule, removeRule, updateUI } from "./updateUI";

export function initUI() {
	initFaq();
	initNavigation();
	initAppearanceUI();
	initImportExport();
	initDonation();

	UI.blockedChannelsSelect.addEventListener("change", (event) => {
		UI.blockedChannelsRemoveBtn.classList.toggle(
			"outlined",
			UI.blockedChannelsSelect.value === "",
		);
	});

	UI.blockedChannelsAddBtn.addEventListener("click", addNewRule);
	UI.blockedChannelsInput.addEventListener("keydown", (event) => {
		if (event.key === "Enter") addNewRule();
	});

	UI.blockedChannelsRemoveBtn.addEventListener("click", removeRule);

	UI.blockedChannelsNav.addEventListener("click", () => {
		setSettingsState(SettingsState.BLOCKED_CHANNELS);
		updateUI();
	});
	UI.blockedTitlesNav.addEventListener("click", () => {
		setSettingsState(SettingsState.BLOCKED_TITLES);
		updateUI();
	});
	UI.blockedNamesNav.addEventListener("click", () => {
		setSettingsState(SettingsState.BLOCKED_NAMES);
		updateUI();
	});
	UI.blockedCommentsNav.addEventListener("click", () => {
		setSettingsState(SettingsState.BLOCKED_COMMENTS);
		updateUI();
	});
	UI.excludedChannelsNav.addEventListener("click", () => {
		setSettingsState(SettingsState.EXCLUDED_CHANNELS);
		updateUI();
	});
	UI.appearanceNav.addEventListener("click", () => {
		setSettingsState(SettingsState.APPEARANCE);
		updateUI();
	});
	UI.importExportNav.addEventListener("click", () => {
		setSettingsState(SettingsState.IMPORT_EXPORT);
		updateUI();
	});
	UI.aboutNav.addEventListener("click", () => {
		setSettingsState(SettingsState.ABOUT);
		updateUI();
	});
	UI.faqNav.addEventListener("click", () => {
		setSettingsState(SettingsState.FAQ);
		updateUI();
	});
}

import {
	CommunicationRole,
	MessageType,
	type SettingsChangedMessage,
	SettingsDesign,
	storage,
} from "core";

const modeDropdown = document.getElementById(
	"mode-dropdown",
) as HTMLSelectElement;
const btnColorInput = document.getElementById(
	"block-btn-color-picker",
) as HTMLInputElement;
const btnSizeSlider = document.getElementById(
	"btn-size-slider",
) as HTMLInputElement;
const popupCheckbox = document.getElementById(
	"popup-checkbox",
) as HTMLInputElement;
const showBtnCheckbox = document.getElementById(
	"show-btn-checkbox",
) as HTMLInputElement;
const animationSpeedSlider = document.getElementById(
	"animation-speed-slider",
) as HTMLInputElement;
const resetBtn = document.getElementById(
	"reset-appearance-btn",
) as HTMLButtonElement;

function updateUI() {
	updateColorScheme();
	updateBtnColor();
	updateBtnSize();
	updatePopup();
	updateShowBtn();
	updateAnimationSpeed();
}

function updateColorScheme() {
	document.body.classList.toggle(
		"detect-scheme",
		storage.settings.ui.design === SettingsDesign.DETECT,
	);
	document.body.classList.toggle(
		"dark-scheme",
		storage.settings.ui.design === SettingsDesign.DARK,
	);
	modeDropdown.value = `${storage.settings.ui.design}`;
}

function updateBtnColor() {
	btnColorInput.value = storage.settings.ui.buttonColor;
}

function updateBtnSize() {
	btnSizeSlider.value = `${storage.settings.ui.buttonSize}`;
}

function updatePopup() {
	popupCheckbox.checked = storage.settings.ui.openPopup;
}

function updateShowBtn() {
	showBtnCheckbox.checked = storage.settings.ui.buttonVisible;
}

function updateAnimationSpeed() {
	animationSpeedSlider.value = `${storage.settings.ui.animationSpeed}`;
}

export function initAppearanceUI() {
	modeDropdown.addEventListener("change", async () => {
		storage.settings.ui.design = Number(modeDropdown.value);
		storage.pushSettings();

		updateColorScheme();
	});

	btnColorInput.addEventListener("change", async () => {
		storage.settings.ui.buttonColor = btnColorInput.value;
		storage.pushSettings();

		updateBtnColor();
		sendSettingChangedMessage();
	});

	btnSizeSlider.addEventListener("change", async () => {
		storage.settings.ui.buttonSize = Number(btnSizeSlider.value);
		storage.pushSettings();

		updateBtnSize();
		sendSettingChangedMessage();
	});

	popupCheckbox.addEventListener("change", async () => {
		storage.settings.ui.openPopup = popupCheckbox.checked;
		storage.pushSettings();

		updatePopup();
	});

	showBtnCheckbox.addEventListener("change", async () => {
		storage.settings.ui.buttonVisible = showBtnCheckbox.checked;
		storage.pushSettings();

		updateShowBtn();
		sendSettingChangedMessage();
	});

	animationSpeedSlider.addEventListener("change", async () => {
		storage.settings.ui.animationSpeed = Number(animationSpeedSlider.value);
		storage.pushSettings();

		updateAnimationSpeed();
		sendSettingChangedMessage();
	});

	resetBtn.addEventListener("click", async () => {
		storage.settings.ui.design = SettingsDesign.DETECT;
		updateUI();
		sendSettingChangedMessage();
	});
}

function sendSettingChangedMessage() {
	const message: SettingsChangedMessage = {
		sender: CommunicationRole.SETTINGS,
		receiver: CommunicationRole.SERVICE_WORKER,
		type: MessageType.SETTINGS_CHANGED,
		content: storage.settings,
	};
	chrome.runtime.sendMessage(message);
}

import {
	CommunicationRole,
	MessageType,
	type SettingsDTO,
	type StorageChangedMessage,
	mapSettingsToDTO,
	storage,
} from "core";

/**
 * Initialize the import and export settings section.
 */
export function initImportExport() {
	const importBtn = document.getElementById("import-btn") as HTMLButtonElement;
	const exportBtn = document.getElementById("export-btn") as HTMLButtonElement;
	const fileLoaderInput = document.getElementById(
		"file-loader-input",
	) as HTMLInputElement;

	fileLoaderInput.addEventListener("change", (event) => {
		const file = fileLoaderInput?.files?.item(0);
		if (file) {
			const fileReader = new FileReader();
			fileReader.addEventListener(
				"load",
				async () => {
					console.log("FileReader loaded");

					try {
						const fileContent = fileReader.result;
						if (typeof fileContent === "string") {
							const fileContentJson = JSON.parse(fileContent) as SettingsDTO;

							storage.setSettings(fileContentJson);
							await storage.pushSettings();

							sendStorageChangeMsg();
						} else {
							throw new Error("Could not read file.");
						}
					} catch (error) {
						console.error(`Error: ${error}`);

						alert(`Error: ${error}`);
					}
				},
				false,
			);
			fileReader.readAsText(file, "UTF-8");
		}
	});

	importBtn.addEventListener(
		"click",
		() => {
			// Check if the file-APIs are supported.
			if (
				!window.File ||
				!window.FileReader ||
				!window.FileList ||
				!window.Blob
			) {
				// The file-APIs are not supported.
				alert("The file-APIs are not supported. You are not able to import.");
				return;
			}
			fileLoaderInput.click();
		},
		false,
	);

	exportBtn.addEventListener("click", () => {
		const currentDate = new Date();
		download(
			JSON.stringify(mapSettingsToDTO(storage.settings), null, 2),
			`ChannelBlocker ${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}.json`,
			".json",
		);
	});
}

/**
 * Creates a file with the given data and downloads it.
 * @param data The content of the file.
 * @param filename The name of the file.
 * @param type The type of the file.
 */
function download(data: BlobPart, filename: string, type: string) {
	const file = new Blob([data], { type: type });
	const a = document.createElement("a");
	const url = URL.createObjectURL(file);

	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	setTimeout(() => {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}, 0);
}

/**
 * Send a message to the service worker, that informs them that the storage was changed
 */
function sendStorageChangeMsg() {
	const message: StorageChangedMessage = {
		sender: CommunicationRole.SETTINGS,
		receiver: CommunicationRole.SERVICE_WORKER,
		type: MessageType.STORAGE_CHANGED,
	};
	chrome.runtime.sendMessage(message);
	console.log("sendStorageChangeMsg");
}

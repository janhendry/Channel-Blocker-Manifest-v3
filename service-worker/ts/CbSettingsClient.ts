import type { StorageObject } from "./interfaces/storage";

export class CbSettingsClient {
	baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	async fetchSettings(id: string) {
		const data = await fetch(`${this.baseUrl}/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		return data.json();
	}

	updateSettings(settings: StorageObject, id: string) {
		return fetch(`${this.baseUrl}/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(settings),
		});
	}

	createSettings(settings: StorageObject) {
		return fetch(this.baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(settings),
		});
	}
}

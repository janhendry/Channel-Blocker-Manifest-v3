import type { Rules, RulesDTO } from "./type/Settings";
import { mapRulesToDTO } from "./util";

export class CbClient {
	baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	async fetchSettings(id: string): Promise<RulesDTO> {
		const data = await fetch(`${this.baseUrl}/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const settingsDTO: RulesDTO = await data.json();
		return settingsDTO;
	}

	updateSettings(filterSettings: RulesDTO, id: string) {
		return fetch(`${this.baseUrl}/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(filterSettings),
		});
	}

	createSettings(filterSettings: RulesDTO) {
		return fetch(this.baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(filterSettings),
		});
	}
}

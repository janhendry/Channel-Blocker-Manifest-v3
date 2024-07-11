import type { Tab } from "core";

/**
 * Limits a value to a range between a minimum and a maximum value.
 * @param min The minimum value.
 * @param max The maximum value.
 * @param value The value to be clamped.
 * @returns
 */
export function clamp(min: number, max: number, value: number): number {
	return Math.max(min, Math.min(max, value));
}

/**
 * Finds all config tab (There should normally just be one) and return them in a list.
 * @returns A list of config tabs.
 */
export async function getConfigTabs(): Promise<Tab[]> {
	const configTabs: Tab[] = [];
	const configURL = chrome.runtime.getURL("/*");
	const tabs = await chrome.tabs.query({ url: configURL });
	for (let index = 0; index < tabs.length; index++) {
		const tab = tabs[index];
		if (tab.id !== undefined) configTabs.push(tab as Tab);
	}
	return configTabs;
}

import type {
	Rules as Roles,
	RulesDTO as RolesDTO,
	Settings,
	SettingsDTO,
} from "./type/Settings";

export function mergeUnique(
	originalArray: string[],
	newArray: string[],
): string[] {
	const mergedArray = [...originalArray];
	for (const item of newArray) {
		if (!originalArray.includes(item)) {
			mergedArray.push(item);
		}
	}
	return mergedArray;
}

export function mergeUniqueSet(
	originalArray: Set<string>,
	newArray: string[],
): Set<string> {
	const mergedArray = new Set(originalArray);
	for (const item of newArray) {
		if (!originalArray.has(item)) {
			mergedArray.add(item);
		}
	}
	return mergedArray;
}

export function mergeRules(original: Roles, newSettings: RolesDTO): Roles {
	return {
		blockedChannels: mergeUniqueSet(
			original.blockedChannels,
			newSettings.blockedChannels,
		),
		excludedChannels: mergeUniqueSet(
			original.excludedChannels,
			newSettings.excludedChannels,
		),
		blockedVideoTitles: {
			...original.blockedVideoTitles,
			...newSettings.blockedVideoTitles,
		},
		blockedChannelsRegExp: {
			...original.blockedChannelsRegExp,
			...newSettings.blockedChannelsRegExp,
		},
		blockedComments: {
			...original.blockedComments,
			...newSettings.blockedComments,
		},
	};
}

export function mapDTOtoRules(dto: RolesDTO): Roles {
	return {
		blockedChannels: new Set(dto.blockedChannels),
		excludedChannels: new Set(dto.excludedChannels),
		blockedVideoTitles: dto.blockedVideoTitles,
		blockedChannelsRegExp: dto.blockedChannelsRegExp,
		blockedComments: dto.blockedComments,
	};
}

export function mapRulesToDTO(roles: Roles): RolesDTO {
	return {
		blockedChannels: Array.from(roles.blockedChannels),
		excludedChannels: Array.from(roles.excludedChannels),
		blockedVideoTitles: roles.blockedVideoTitles,
		blockedChannelsRegExp: roles.blockedChannelsRegExp,
		blockedComments: roles.blockedComments,
	};
}

export function mapSettingsToDTO(settings: Settings): SettingsDTO {
	return {
		...settings,
		rules: mapRulesToDTO(settings.rules),
	};
}

export function mapDTOtoSettings(dto: SettingsDTO): Settings {
	return {
		...dto,
		rules: mapDTOtoRules(dto.rules),
	};
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function log(header: string, ...message: any[]) {
	if (header) {
		console.log(
			`%c[${header}]`,
			"color: white; background-color: blue; padding: 3px; border-radius: 5px;",
			...message,
		);
	} else {
		console.log(...message);
	}
}

import { type IsBlockedMessage, storage } from "core";

/**
 * Checks if the given userChannelName, videoTitle or commentContent matches any of the blocking rules.
 * @param message The message containing userChannelName, videoTitle or commentContent.
 * @returns
 */
export function handleIsBlockedMessage(message: IsBlockedMessage): boolean {
	if (message.content.userChannelName !== undefined) {
		if (
			storage.settings.rules.excludedChannels.has(
				message.content.userChannelName,
			)
		)
			return false;
		if (
			storage.settings.rules.blockedChannels.has(
				message.content.userChannelName,
			)
		)
			return true;
		for (const key in storage.settings.rules.blockedChannelsRegExp) {
			if (
				Object.prototype.hasOwnProperty.call(
					storage.settings.rules.blockedChannelsRegExp,
					key,
				)
			) {
				const regEgx = new RegExp(
					key,
					storage.settings.rules.blockedChannelsRegExp[key],
				);
				if (regEgx.test(message.content.userChannelName)) return true;
			}
		}
	}
	if (message.content.videoTitle !== undefined) {
		for (const key in storage.settings.rules.blockedVideoTitles) {
			if (
				Object.prototype.hasOwnProperty.call(
					storage.settings.rules.blockedVideoTitles,
					key,
				)
			) {
				const regEgx = new RegExp(
					key,
					storage.settings.rules.blockedVideoTitles[key],
				);
				if (regEgx.test(message.content.videoTitle)) return true;
			}
		}
	}
	if (message.content.commentContent !== undefined) {
		for (const key in storage.settings.rules.blockedComments) {
			if (
				Object.prototype.hasOwnProperty.call(
					storage.settings.rules.blockedComments,
					key,
				)
			) {
				const regEgx = new RegExp(
					key,
					storage.settings.rules.blockedComments[key],
				);
				if (regEgx.test(message.content.commentContent)) return true;
			}
		}
	}
	return false;
}

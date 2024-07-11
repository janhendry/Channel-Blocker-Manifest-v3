import { type RemoveBlockingRuleMessage, storage } from "core";
import { sendStorageChangedMessage } from "../sendMessage/sendStorageChangedMessage";

/**
 * Remove a blocking rule from the storage and send a storage changed message to all tabs running YouTube.
 * @param message The message containing the blocking rule to remove.
 */
export async function handleRemoveBlockingRuleMessage(
	message: RemoveBlockingRuleMessage,
) {
	const settings = storage.settings;
	if (message.content.blockedChannel !== undefined) {
		for (
			let index = 0;
			index < message.content.blockedChannel.length;
			index++
		) {
			settings.rules.blockedChannels.delete(
				message.content.blockedChannel[index],
			);
		}
	}
	if (message.content.blockingChannelRegExp !== undefined) {
		for (
			let index = 0;
			index < message.content.blockingChannelRegExp.length;
			index++
		) {
			delete settings.rules.blockedChannelsRegExp[
				message.content.blockingChannelRegExp[index]
			];
		}
	}
	if (message.content.blockingCommentRegExp !== undefined) {
		for (
			let index = 0;
			index < message.content.blockingCommentRegExp.length;
			index++
		) {
			delete settings.rules.blockedComments[
				message.content.blockingCommentRegExp[index]
			];
		}
	}
	if (message.content.blockingVideoTitleRegExp !== undefined) {
		for (
			let index = 0;
			index < message.content.blockingVideoTitleRegExp.length;
			index++
		) {
			delete settings.rules.blockedVideoTitles[
				message.content.blockingVideoTitleRegExp[index]
			];
		}
	}
	if (message.content.excludedChannel !== undefined) {
		for (
			let index = 0;
			index < message.content.excludedChannel.length;
			index++
		) {
			settings.rules.excludedChannels.delete(
				message.content.excludedChannel[index],
			);
		}
	}

	storage.pushSettings();
	sendStorageChangedMessage();
}

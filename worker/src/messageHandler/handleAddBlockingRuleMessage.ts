import { type AddBlockingRuleMessage, storage } from "core";
import { sendStorageChangedMessage } from "../sendMessage/sendStorageChangedMessage";

/**
 * Add a blocking rule to the storage and send a storage changed message to all tabs running YouTube.
 * @param message The message containing the blocking rule to add.
 */
export async function handleAddBlockingRuleMessage(
	message: AddBlockingRuleMessage,
) {
	if (message.content.blockedChannel !== undefined) {
		storage.settings.rules.blockedChannels.add(message.content.blockedChannel);
	}
	if (message.content.blockingChannelRegExp !== undefined) {
		storage.settings.rules.blockedChannelsRegExp[
			message.content.blockingChannelRegExp
		] = message.content.caseInsensitive ? "i" : "";
	}
	if (message.content.blockingCommentRegExp !== undefined) {
		storage.settings.rules.blockedComments[
			message.content.blockingCommentRegExp
		] = message.content.caseInsensitive ? "i" : "";
	}
	if (message.content.blockingVideoTitleRegExp !== undefined) {
		storage.settings.rules.blockedVideoTitles[
			message.content.blockingVideoTitleRegExp
		] = message.content.caseInsensitive ? "i" : "";
	}
	if (message.content.excludedChannel !== undefined) {
		storage.settings.rules.excludedChannels.add(
			message.content.excludedChannel,
		);
	}

	storage.pushSettings();
	sendStorageChangedMessage();
}

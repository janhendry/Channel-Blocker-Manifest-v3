import type { Settings, SettingsDTO } from "./Settings";
import type { CommunicationRole, MessageType } from "./enums";

export type Message =
	| AddBlockingRuleMessage
	| RemoveBlockingRuleMessage
	| IsBlockedMessage
	| StorageChangedMessage
	| RequestSettingsMessage
	| SettingsChangedMessage;

export type MessageCore = {
	sender: CommunicationRole;
	receiver: CommunicationRole;
};

export type AddBlockingRuleMessage = MessageCore & {
	type: MessageType.ADD_BLOCKING_RULE;
	content: {
		blockedChannel?: string;
		excludedChannel?: string;
		blockingChannelRegExp?: string;
		blockingCommentRegExp?: string;
		blockingVideoTitleRegExp?: string;
		caseInsensitive?: boolean;
	};
};

export type RemoveBlockingRuleMessage = MessageCore & {
	type: MessageType.REMOVE_BLOCKING_RULE;
	content: {
		blockedChannel?: string[];
		excludedChannel?: string[];
		blockingChannelRegExp?: string[];
		blockingCommentRegExp?: string[];
		blockingVideoTitleRegExp?: string[];
	};
};

export type RequestSettingsMessage = MessageCore & {
	type: MessageType.REQUEST_SETTINGS;
};

export type SettingsChangedMessage = MessageCore & {
	type: MessageType.SETTINGS_CHANGED;
	content: SettingsDTO;
};

export type IsBlockedMessage = MessageCore & {
	type: MessageType.IS_BLOCKED;
	content: {
		videoTitle?: string;
		userChannelName?: string;
		commentContent?: string;
	};
};

export type StorageChangedMessage = MessageCore & {
	type: MessageType.STORAGE_CHANGED;
};

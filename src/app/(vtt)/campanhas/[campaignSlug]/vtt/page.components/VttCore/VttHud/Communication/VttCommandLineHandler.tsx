import { CampaignMember, Guid } from "@/libs/stp@types";
import { VttInputMessageType } from "../../../Types/Static/VttInputMessageType";
import { VttChatMessage } from "../../../Types/Classes/ChatMessage";
import { VttInputMessage } from "../../../Types/VttInputMessage";
import { sendPing } from "../../Other/PingEngine";
import { WindowCursorState } from "../../../Contexts/WindowStates";
import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";
import { roundCoordinate } from "../../../Utils/CoodinateUtils";
import { PingType } from "../../Other/PingEngine/PingRadialWheelTypes";

interface VttCommandLineHandlerProps {
	text: string;
	userId: Guid;
	messageToReplyId?: Guid;
	messageToReply?: VttChatMessage;
	members: CampaignMember[];
	send: (message: VttInputMessage) => void;
	screenToWorld: (position: CoordinatePair) => CoordinatePair;
	allChatMessages: VttChatMessage[];
}
export async function VttCommandLineHandler({
	text,
	userId,
	messageToReply,
	messageToReplyId,
	members,
	send,
	screenToWorld,
	allChatMessages,
}: VttCommandLineHandlerProps): Promise<{
	type?: VttInputMessageType;
	data?: object;
	shouldReset: boolean;
}> {
	if (!text.startsWith("/"))
		return defaultReturn({ text, messageToReply, messageToReplyId });

	if (text.startsWith("/exit")) {
		const url = new URL(window.location.href);
		url.pathname = url.pathname.replace(/\/[^/]+\/?$/, "") || "/";
		window.location.href = url.toString();
		return { shouldReset: false };
	}
	if (text.startsWith("/r")) {
		const message = allChatMessages.findLast(
			(message) =>
				message.recipients.length > 1 && message.recipients.includes(userId),
		);
		const finalMessage = text.slice(2);
		if (!message || !finalMessage.trim()) return { shouldReset: false };
		return defaultReturn({
			text: finalMessage,
			messageToReply: message,
			messageToReplyId: message.id,
		});
	} else if (text == "/ping" || text.startsWith("/ping ")) {
		const pingText = text.slice(5).trim();
		let pingType = "Default";

		if (pingText) {
			const normalize = (value: string) =>
				value
					.toLowerCase()
					.normalize("NFD")
					.replace(/[\u0300-\u036f]/g, "");

			const getLevenshteinDistance = (a: string, b: string) => {
				const previous = Array.from(
					{ length: b.length + 1 },
					(_, index) => index,
				);

				for (let i = 1; i <= a.length; i++) {
					const current = [i];

					for (let j = 1; j <= b.length; j++)
						current[j] = Math.min(
							current[j - 1] + 1,
							previous[j] + 1,
							previous[j - 1] + (a[i - 1] == b[j - 1] ? 0 : 1),
						);

					for (let j = 0; j <= b.length; j++) previous[j] = current[j];
				}

				return previous[b.length];
			};

			const normalizedText = normalize(pingText);

			pingType = Object.keys(PingType).reduce(
				(closest, type) =>
					getLevenshteinDistance(normalizedText, normalize(type)) <
					getLevenshteinDistance(normalizedText, normalize(closest))
						? type
						: closest,
				"Default",
			);
		}

		sendPing({
			send,
			type: pingType as keyof typeof PingType,
			position: roundCoordinate(
				screenToWorld({
					x: WindowCursorState.x,
					y: WindowCursorState.y,
				}),
			),
		});

		return {
			shouldReset: true,
		};
	} else if (text.startsWith("/p") || text.startsWith("/private")) {
		if (!(text.startsWith("/p ") || text.startsWith("/private ")))
			return { shouldReset: false };

		const commandLength = text.startsWith("/private") ? 9 : 3;

		const messageText = text.slice(commandLength);
		if (!messageText.trim()) return { shouldReset: false };

		return {
			shouldReset: true,
			type: "PostChatMessage",
			data: {
				text: messageText,
				messageToReplyId,
				recipients: [userId],
				private: true,
			},
		};
	} else if (text.startsWith("/w") || text.startsWith("/whisper")) {
		const commandLength = text.startsWith("/whisper") ? 9 : 3;
		const usernameEnd = text.indexOf(" ", commandLength);

		if (usernameEnd == -1) return { shouldReset: false };

		const username = text.slice(commandLength, usernameEnd);
		const messageText = text.slice(usernameEnd + 1);
		const member = members.find((member) => member.user.username == username);

		if (!messageText.trim() || !member) return { shouldReset: false };

		return {
			shouldReset: true,
			type: "PostChatMessage",
			data: {
				text: messageText,
				messageToReplyId,
				recipients: [member.userId],
			},
		};
	}

	return defaultReturn({ text, messageToReply, messageToReplyId });
}

interface DefaultReturnProps {
	text: string;
	messageToReplyId?: Guid;
	messageToReply?: VttChatMessage;
}
function defaultReturn({
	text,
	messageToReply,
	messageToReplyId,
}: DefaultReturnProps) {
	return {
		shouldReset: true,
		type: "PostChatMessage" as VttInputMessageType,
		data: {
			text,
			messageToReplyId,
			recipients: messageToReply?.recipients,
		},
	};
}

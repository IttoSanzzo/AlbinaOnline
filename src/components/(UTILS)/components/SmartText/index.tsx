import { StyledLink } from "@/components/(Design)";
import { SmartTextContainer } from "./styledElements";
import { capitalizeAll } from "@/utils/StringUtils";
import { ReactNode } from "react";
import { NotionQuote } from "@/components/(NotionBased)";

function getSmartLink(href: string): ReactNode {
	const title = capitalizeAll(href.slice(href.lastIndexOf("/") + 1));

	return (
		<StyledLink
			key={href}
			title={title}
			href={href}
			icon={`${process.env.ALBINA_API}/favicon${href}`}
			textMode={true}
		/>
	);
}
function getSmartQuote(quote: string, key: any): ReactNode {
	return (
		<NotionQuote
			key={key}
			children={quote}
		/>
	);
}

const smartTriggerCharacters = "@Q";
function isSmartOpeningTrigger(characters: string, index: number): boolean {
	if (
		smartTriggerCharacters.includes(characters[index + 1]) &&
		characters[index + 2] === "/"
	)
		return true;
	return false;
}
function isSmartClosingTrigger(characters: string, index: number): boolean {
	if (characters[index] === "]") return true;
	return false;
}

interface SmartTextProps {
	content?: string;
}
export function SmartText({ content }: SmartTextProps) {
	if (!content) return <></>;

	const parts = [];
	let index = -1;
	let lastIndex = 0;

	while (++index < content.length) {
		if (content[index] && isSmartOpeningTrigger(content, index)) {
			const start = index;
			let depth = 1;
			index += 3;

			while (index < content.length && depth > 0) {
				if (content[index] && isSmartOpeningTrigger(content, index)) ++depth;
				else if (isSmartClosingTrigger(content, index)) --depth;
				++index;
			}
			if (depth === 0) {
				if (lastIndex < start) parts.push(content.slice(lastIndex, start));

				switch (content[start + 1]) {
					case "@":
						parts.push(getSmartLink(content.slice(start + 2, index - 1)));
						break;
					case "Q":
						parts.push(
							getSmartQuote(content.slice(start + 3, index - 1), index)
						);
						break;
				}

				lastIndex = index;
				continue;
			}
		}
	}

	if (lastIndex < content.length) {
		parts.push(content.slice(lastIndex));
	}
	return <SmartTextContainer>{parts}</SmartTextContainer>;
}

// const linkRegex = /\[([@Q]\/[^\]]+)\]/g;

// export function SmartText({ content }: SmartTextProps) {
// 	if (!content) return <></>;

// 	const parts = [];
// 	let lastIndex = 0;
// 	let match;

// 	while ((match = linkRegex.exec(content)) != null) {
// 		const [full, reference] = match;
// 		const start = match.index;

// 		parts.push(content.slice(lastIndex, start));
// 		switch (reference[0]) {
// 			case "@":
// 				parts.push(getSmartLink(reference.slice(1)));
// 				break;
// 			case "Q":
// 				parts.push(getSmartQuote(reference.slice(2), start));
// 				break;
// 		}

// 		lastIndex = start + full.length;
// 	}
// 	parts.push(content.slice(lastIndex));

// 	return <SmartTextContainer>{parts}</SmartTextContainer>;
// }

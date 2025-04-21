import { StyledLink } from "@/components/(Design)";
import { SmartTextContainer } from "./styledElements";
import { capitalizeTitle } from "@/utils/StringUtils";
import { ReactNode } from "react";
import { NotionBullet, NotionQuote } from "@/components/(NotionBased)";
import { title } from "process";

function getSmartLink(href: string, key: any): ReactNode {
	const hrefIsId = href.includes("#");
	const title = hrefIsId
		? capitalizeTitle(href.slice(href.lastIndexOf("#") + 1).replace(/-/g, " "))
		: capitalizeTitle(href.slice(href.lastIndexOf("/") + 1).replace(/-/g, " "));

	const iconUrl = hrefIsId ? href.slice(0, href.lastIndexOf("#")) : href;

	return (
		<StyledLink
			key={key}
			title={title}
			href={href}
			icon={`${process.env.ALBINA_API}/favicon${iconUrl}`}
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
function getSmartBullet(item: string, key: any): ReactNode {
	return (
		<NotionBullet
			key={key}
			children={item}
		/>
	);
}

const smartTriggerCharacters = "@QB";
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
	let index = 0;
	let lastIndex = 0;

	while (index < content.length) {
		if (content[index] === "[" && isSmartOpeningTrigger(content, index)) {
			const start = index;
			let depth = 1;
			index += 3;

			while (index < content.length && depth > 0) {
				if (content[index] === "[" && isSmartOpeningTrigger(content, index))
					++depth;
				else if (isSmartClosingTrigger(content, index)) --depth;
				++index;
			}
			if (depth === 0) {
				if (lastIndex < start) parts.push(content.slice(lastIndex, start));

				switch (content[start + 1]) {
					case "@":
						parts.push(
							getSmartLink(content.slice(start + 2, index - 1), index)
						);
						break;
					case "Q":
						parts.push(
							getSmartQuote(content.slice(start + 3, index - 1), index)
						);
						break;
					case "B":
						parts.push(
							getSmartBullet(content.slice(start + 3, index - 1), index)
						);
						break;
				}

				lastIndex = index;
				continue;
			}
		}
		++index;
	}

	if (lastIndex < content.length) {
		parts.push(content.slice(lastIndex));
	}
	return <SmartTextContainer>{parts}</SmartTextContainer>;
}

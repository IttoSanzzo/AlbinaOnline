import { StyledLink } from "@/components/(Design)";
import { ReactNode } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StandartTextColor, UIBasics } from "../..";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";

const SmartTextContainer = newStyledElement.div(styles.smartTextContainer);

function getSmartLink(smartSlice: string, key: number): ReactNode {
	if (smartSlice[0] !== "[") return <p key={key}>"-SmartLinkError-"</p>;

	const titleEnd = smartSlice.indexOf("]");
	const title = smartSlice.slice(1, titleEnd);

	const href = `/${smartSlice.slice(titleEnd + 1)}`;
	const indexOfId = href.lastIndexOf("#");
	const iconUrl =
		indexOfId !== -1 ? href.slice(0, href.lastIndexOf("#")) : href;

	return (
		<StyledLink
			key={key}
			title={title}
			href={href}
			icon={getAlbinaApiAddress(`/favicon${iconUrl}`)}
			textMode={true}
		/>
	);
}
function getSmartToggle(smartSlice: string, key: number): ReactNode {
	if (smartSlice[0] !== "[") return <p key={key}>"-SmartToggleError-"</p>;

	const titleEnd = smartSlice.indexOf("]");
	const title = smartSlice.slice(1, titleEnd);
	const content = smartSlice.slice(titleEnd + 1);

	return (
		<UIBasics.Toggle
			key={key}
			title={title}
			children={content}
		/>
	);
}
function getSmartQuote(quote: string, key: number): ReactNode {
	return (
		<UIBasics.Quote
			key={key}
			children={quote}
		/>
	);
}
function getSmartBullet(item: string, key: number): ReactNode {
	return (
		<UIBasics.Bullet
			key={key}
			children={item}
		/>
	);
}
function getSmartColor(smartSlice: string, key: number): ReactNode {
	if (smartSlice[0] !== "[") return <p key={key}>"-SmartColorError-"</p>;

	const colorEnd = smartSlice.indexOf("]");
	const color = smartSlice.slice(1, colorEnd);
	const content = smartSlice.slice(colorEnd + 1);

	return (
		<UIBasics.Text
			key={key}
			children={content}
			textColor={color as keyof typeof StandartTextColor}
		/>
	);
}

const smartTriggerCharacters = "@QBTC";
function isSmartOpeningTrigger(characters: string, index: number): boolean {
	if (
		smartTriggerCharacters.includes(characters[index + 1]) &&
		characters[index + 2] === "/"
	)
		return true;
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
				if (content[index] === "[") ++depth;
				else if (content[index] === "]") --depth;
				++index;
			}
			if (depth === 0) {
				if (lastIndex < start) parts.push(content.slice(lastIndex, start));

				switch (content[start + 1]) {
					case "@":
						parts.push(
							getSmartLink(content.slice(start + 3, index - 1), index)
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
					case "T":
						parts.push(
							getSmartToggle(content.slice(start + 3, index - 1), index)
						);
						break;
					case "C":
						parts.push(
							getSmartColor(content.slice(start + 3, index - 1), index)
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

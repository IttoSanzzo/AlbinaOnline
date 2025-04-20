import { StyledLink } from "@/components/(Design)";
import { SmartTextContainer } from "./styledElements";
import { capitalizeAll } from "@/utils/StringUtils";

interface SmartTextProps {
	content?: string;
}

const linkRegex = /\[(@[^\]]+)\]/g;

export function SmartText({ content }: SmartTextProps) {
	if (!content) return <></>;

	const parts = [];
	let lastIndex = 0;
	let match;

	while ((match = linkRegex.exec(content)) != null) {
		const [full, reference] = match;
		const start = match.index;
		const href = reference.slice(1);
		const title = capitalizeAll(href.slice(href.lastIndexOf("/") + 1));

		parts.push(content.slice(lastIndex, start));
		parts.push(
			<StyledLink
				key={href}
				title={title}
				href={href}
				icon={`${process.env.ALBINA_API}/favicon${href}`}
				textMode={true}
			/>
		);
		lastIndex = start + full.length;
	}
	parts.push(content.slice(lastIndex));

	return <SmartTextContainer>{parts}</SmartTextContainer>;
}

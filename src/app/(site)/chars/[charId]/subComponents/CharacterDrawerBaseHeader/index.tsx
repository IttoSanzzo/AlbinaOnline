import {
	NotionBackgroundColor,
	NotionBox,
	NotionToggleHeader,
} from "@/components/(NotionBased)";
import { ReactNode } from "react";

interface CharacterDrawerBaseHeaderProps {
	title: string;
	memoryId: string;
	backgroundColor?: keyof typeof NotionBackgroundColor;
	children?: ReactNode;
}
export function CharacterDrawerBaseHeader({
	backgroundColor,
	memoryId,
	title,
	children,
}: CharacterDrawerBaseHeaderProps) {
	return (
		<NotionToggleHeader
			title={title}
			titleColor="gray"
			backgroundColor="darkGray"
			contentMargin="none"
			memoryId={memoryId}>
			<NotionBox
				backgroundColor={backgroundColor}
				withoutPadding
				withoutBorder
				children={children}
			/>
		</NotionToggleHeader>
	);
}

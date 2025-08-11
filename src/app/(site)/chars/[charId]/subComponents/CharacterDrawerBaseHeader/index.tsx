import { StandartBackgroundColor, UIBasics } from "@/components/(UIBasics)";
import { ReactNode } from "react";

interface CharacterDrawerBaseHeaderProps {
	title: string;
	memoryId: string;
	backgroundColor?: keyof typeof StandartBackgroundColor;
	children?: ReactNode;
}
export function CharacterDrawerBaseHeader({
	backgroundColor,
	memoryId,
	title,
	children,
}: CharacterDrawerBaseHeaderProps) {
	return (
		<UIBasics.ToggleHeader
			title={title}
			titleColor="gray"
			backgroundColor="darkGray"
			contentMargin="none"
			memoryId={memoryId}>
			<UIBasics.Box
				backgroundColor={backgroundColor}
				withoutPadding
				withoutBorder
				children={children}
			/>
		</UIBasics.ToggleHeader>
	);
}

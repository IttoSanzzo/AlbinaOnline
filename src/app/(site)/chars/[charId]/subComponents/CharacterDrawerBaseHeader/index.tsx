import { StandartBackgroundColor, UIBasics } from "@/components/(UIBasics)";
import { ReactNode } from "react";

interface CharacterDrawerBaseHeaderProps {
	title: string;
	memoryId: string;
	backgroundColor?: keyof typeof StandartBackgroundColor;
	children?: ReactNode;
	roundUp?: boolean;
}
export function CharacterDrawerBaseHeader({
	backgroundColor,
	memoryId,
	title,
	children,
	roundUp = false,
}: CharacterDrawerBaseHeaderProps) {
	return (
		<UIBasics.ToggleHeader
			title={title}
			titleColor="gray"
			backgroundColor="darkGray"
			contentMargin="none"
			memoryId={memoryId}
			style={
				roundUp
					? {
							borderTopLeftRadius: "var(--rd-md)",
							borderTopRightRadius: "var(--rd-md)",
						}
					: undefined
			}>
			<UIBasics.Box
				backgroundColor={backgroundColor}
				withoutPadding
				withoutBorder
				children={children}
			/>
		</UIBasics.ToggleHeader>
	);
}

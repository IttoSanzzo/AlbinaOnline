import { StandartBackgroundColor, UIBasics } from "@/components/(UIBasics)";
import { ReactNode } from "react";

interface NpcDrawerBaseHeaderProps {
	title: string;
	memoryId: string;
	backgroundColor?: keyof typeof StandartBackgroundColor;
	children?: ReactNode;
}
export function NpcDrawerBaseHeader({
	backgroundColor,
	memoryId,
	title,
	children,
}: NpcDrawerBaseHeaderProps) {
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

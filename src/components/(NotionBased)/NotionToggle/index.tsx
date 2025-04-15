"use client";

import {
	NotionBackgroundColor,
	NotionPropsColor,
	NotionTextColor,
} from "@/utils/NotionBasedUtils";
import {
	ContentContainer,
	HeaderContainer,
	NotionToggleContainer,
} from "./styledElements";
import { CSSProperties, ReactNode, useState } from "react";
import { Triangle } from "@phosphor-icons/react/Triangle";

interface NotionToggleProps extends NotionPropsColor {
	children: ReactNode;
	title: ReactNode;
}

export default function NotionToggle({
	children,
	title,
	textColor,
	backgroundColor,
}: NotionToggleProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const arrowRotationDegree = isOpen ? "180deg" : "90deg";

	function handleOpenButton() {
		setIsOpen(!isOpen);
	}

	const style: CSSProperties = {
		...(textColor && { color: NotionTextColor[textColor] }),
		...(backgroundColor && {
			backgroundColor: NotionBackgroundColor[backgroundColor],
		}),
	};

	return (
		<NotionToggleContainer style={style}>
			<HeaderContainer>
				<button onClick={handleOpenButton}>
					<Triangle
						size={11}
						weight="fill"
						color={
							textColor ? NotionTextColor[textColor] : NotionTextColor.default
						}
						style={{ rotate: arrowRotationDegree }}
					/>
				</button>
				{title}
			</HeaderContainer>
			{isOpen && <ContentContainer>{children}</ContentContainer>}
		</NotionToggleContainer>
	);
}

import { NotionPropsColor } from "@/utils/NotionBasedUtils";
import { HeaderContainer, NotionCalloutContainer } from "./styledElements";
import { CSSProperties, ReactNode } from "react";
import Image, { StaticImageData } from "next/image";

interface NotionCalloutProps extends NotionPropsColor {
	children?: ReactNode;
	title?: ReactNode;
	icon?: string | StaticImageData;
}

export default function NotionCallout({
	title,
	icon = "",
	children,
	textColor,
	backgroundColor,
}: NotionCalloutProps) {
	const style: CSSProperties = {
		...(textColor && { color: textColor }),
		...(backgroundColor && {
			backgroundColor: backgroundColor,
			borderColor: backgroundColor,
		}),
	};

	return (
		<NotionCalloutContainer style={style}>
			<HeaderContainer>
				<Image
					src={icon}
					alt=""
				/>
				{title}
			</HeaderContainer>
			<div>{children}</div>
		</NotionCalloutContainer>
	);
}

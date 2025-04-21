import { CSSProperties, ReactNode } from "react";
import {
	NotionBackgroundColor,
	NotionPropsColor,
	NotionTextColor,
} from "../../core/NotionBasedCore";
import {
	BeforeBullet,
	ContentContainer,
	NotionBulletContainer,
} from "./styledElements";
import { NotionText } from "../NotionText";

interface NotionBulletProps extends NotionPropsColor {
	children?: ReactNode | string;
}

export function NotionBullet({
	children,
	textColor,
	backgroundColor,
}: NotionBulletProps) {
	const style: CSSProperties = {
		...(textColor && { color: NotionTextColor[textColor] }),
		...(backgroundColor && {
			backgroundColor: NotionBackgroundColor[backgroundColor],
		}),
	};

	return (
		<NotionBulletContainer style={style}>
			<BeforeBullet
				style={{
					backgroundColor: textColor
						? NotionTextColor[textColor]
						: NotionTextColor.default,
				}}
			/>
			<ContentContainer>
				{typeof children === "string" ? (
					<NotionText>{children}</NotionText>
				) : (
					children
				)}
			</ContentContainer>
		</NotionBulletContainer>
	);
}

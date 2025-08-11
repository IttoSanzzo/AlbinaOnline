import { CSSProperties, ReactNode } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StandartColorProps, StandartTextColor } from "../../core";
import {
	StandartBackgroundColorKeyToProperty,
	StandartColorKeysToProperties,
	StandartTextColorKeyToProperty,
} from "../../utils";
import { UIBasics } from "../..";

const BulletContainer = newStyledElement.div(styles.bulletContainer);
const BeforeBullet = newStyledElement.div(styles.beforeBullet);
const ContentContainer = newStyledElement.div(styles.contentContainer);

interface BulletProps extends StandartColorProps {
	children?: ReactNode | string;
}
export function Bullet({ children, textColor, backgroundColor }: BulletProps) {
	const style = StandartColorKeysToProperties(textColor, backgroundColor);

	return (
		<BulletContainer style={style}>
			<BeforeBullet
				style={{
					backgroundColor: textColor
						? StandartTextColor[textColor]
						: StandartTextColor.default,
				}}
			/>
			<ContentContainer>
				{typeof children === "string" ? (
					<UIBasics.Text>{children}</UIBasics.Text>
				) : (
					children
				)}
			</ContentContainer>
		</BulletContainer>
	);
}

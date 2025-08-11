import { UIBasics } from "@/components/(UIBasics)";
import { StpIconProps } from "@/libs/stp@icons";
import { GenericEffect } from "@/libs/stp@types";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

export const GenericEffectsDisplayContainer = newStyledElement.div(
	styles.genericEffectsDisplayContainer
);

interface GenericEffectsDisplayProps {
	effects: GenericEffect[];
}

function getIconProps(name: string): StpIconProps {
	switch (name) {
		case "Primário":
			return { name: "PlusCircle", color: "purple" };
		case "Up":
			return { name: "ArrowFatLineUp", color: "purple" };
		default:
			return { name: "Sun", color: "default" };
	}
}

export function GenericEffectsDisplay({ effects }: GenericEffectsDisplayProps) {
	if (effects.length == 0) return <></>;
	return (
		<GenericEffectsDisplayContainer>
			<UIBasics.Header
				textColor="orange"
				backgroundColor="gray"
				textAlign="center"
				children={"🏮 Efeitos 🏮"}
			/>
			{effects.map((effect, index) => {
				const iconProps = getIconProps(effect.role);
				const fullTitle = effect.name ? (
					<div style={{ display: "flex", gap: "0.5rem" }}>
						<UIBasics.Text
							textColor={iconProps.color}
							children={`${effect.role} -`}
						/>
						<UIBasics.Text
							textColor={effect.color}
							children={effect.name}
						/>
					</div>
				) : (
					effect.role
				);

				return (
					<UIBasics.Callout
						key={index}
						icon={iconProps}
						titleColor={iconProps.color}
						title={fullTitle}>
						{effect.contents.map((content, index) => (
							<UIBasics.Quote
								key={index}
								children={content.value}
								textColor={content.color}
							/>
						))}
					</UIBasics.Callout>
				);
			})}
		</GenericEffectsDisplayContainer>
	);
}

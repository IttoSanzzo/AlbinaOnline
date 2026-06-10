import { UIBasics } from "@/components/(UIBasics)";
import { StpIconProps } from "@/libs/stp@icons";
import { GenericEffect } from "@/libs/stp@types";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { AnchorProps, SetAnchorNavigation } from "@/libs/stp@hooks";
import { idfyString } from "@/utils/StringUtils";

export const GenericEffectsDisplayContainer = newStyledElement.div(
	styles.genericEffectsDisplayContainer,
);

interface GenericEffectsDisplayProps {
	effects: GenericEffect[];
	preAnchors?: AnchorProps[];
	postAnchors?: AnchorProps[];
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

export function GenericEffectsDisplay({
	effects,
	preAnchors = [],
	postAnchors = [],
}: GenericEffectsDisplayProps) {
	if (effects.length == 0)
		return preAnchors.length == 0 && postAnchors.length == 0 ? null : (
			<SetAnchorNavigation anchors={[...preAnchors, ...postAnchors]} />
		);
	const effectAnchors: AnchorProps[] = [];

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
				const id = `effect-${idfyString(effect.name ?? effect.role)}`;
				effectAnchors.push({
					name: effect.name ?? effect.role,
					id: id,
					indentation: 1,
				});

				return (
					<UIBasics.Callout
						key={index}
						id={id}
						icon={iconProps}
						titleColor={iconProps.color}
						title={fullTitle}>
						{effect.contents.map((content, index) => (
							<UIBasics.Quote
								whiteSpace="pre-wrap"
								key={index}
								children={content.value}
								textColor={content.color}
							/>
						))}
					</UIBasics.Callout>
				);
			})}
			{(preAnchors.length > 0 || postAnchors.length > 0) && (
				<SetAnchorNavigation
					anchors={[
						...preAnchors,
						{ name: "🏮 Efeitos 🏮", id: "-efeitos-" },
						...effectAnchors,
						...postAnchors,
					]}
				/>
			)}
		</GenericEffectsDisplayContainer>
	);
}

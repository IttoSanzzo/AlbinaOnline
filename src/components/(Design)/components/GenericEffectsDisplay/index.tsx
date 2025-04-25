import {
	NotionCallout,
	NotionHeader,
	NotionQuote,
} from "@/components/(NotionBased)";
import { GenericEffectsDisplayContainer } from "./styledElements";
import { StpIconProps } from "@/libs/stp@icons";
import { GenericEffect } from "@/libs/stp@types";

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
			<NotionHeader
				textColor="orange"
				backgroundColor="gray"
				textAlign="center"
				children={"🏮 Efeitos 🏮"}
			/>
			{effects.map((effect, index) => {
				const iconProps = getIconProps(effect.role);
				return (
					<NotionCallout
						key={index}
						icon={iconProps}
						titleColor={iconProps.color}
						title={effect.role}>
						{effect.contents.map((content, index) => (
							<NotionQuote
								key={index}
								children={content.value}
							/>
						))}
					</NotionCallout>
				);
			})}
		</GenericEffectsDisplayContainer>
	);
}

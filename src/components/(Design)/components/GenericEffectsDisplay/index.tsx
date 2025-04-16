import {
	NotionCallout,
	NotionHeader,
	NotionQuote,
} from "@/components/(NotionBased)";
import { GenericEffectsDisplayContainer } from "./styledElements";
import { GenericEffect } from "@/app/(site)/maestrias/[mastery]/(routeInfra)/pageData";

interface GenericEffectsDisplayProps {
	effects: GenericEffect[];
}

export function GenericEffectsDisplay({ effects }: GenericEffectsDisplayProps) {
	return (
		<GenericEffectsDisplayContainer>
			<NotionHeader
				textColor="orange"
				backgroundColor="gray"
				textAlign="center"
				children={"🏮 Efeitos 🏮"}
			/>
			{effects.map((effect, index) => (
				<NotionCallout
					key={index}
					icon={{ name: "PlusCircle", color: "purple" }}
					titleColor="purple"
					title={effect.name}>
					{effect.info.map((info, index) => (
						<NotionQuote
							key={index}
							children={info}
						/>
					))}
				</NotionCallout>
			))}
		</GenericEffectsDisplayContainer>
	);
}

"use client";

import { UIBasics } from "@/components/(UIBasics)";
import { GenericEffect, Guid } from "@/libs/stp@types";
import { GenericEffectEditor } from "./subComponents/GenericEffectEditor";
import { LinkEffect } from "./subComponents/LinkEffect";
import { usePathname } from "next/navigation";
import { CreateEffect } from "./subComponents/CreateEffect";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { ReorderEffects } from "./subComponents/ReorderEffects";

const EffectActionButtonsContainer = newStyledElement.div(
	styles.effectActionButtonsContainer
);

export type EntityEffectEditTarget =
	| "Item"
	| "Skill"
	| "Spell"
	| "Mastery"
	| "Trait";

interface EntityEffectsEditorProps {
	targetId: Guid;
	targetType: EntityEffectEditTarget;
	genericEffects: GenericEffect[];
	revalidatePath?: string;
}
export function EntityEffectsEditor({
	targetId,
	targetType,
	genericEffects,
	revalidatePath,
}: EntityEffectsEditorProps) {
	const pathname = usePathname();
	const effectsInOrder = genericEffects.sort((e1, e2) => e1.order - e2.order);

	return (
		<UIBasics.Box backgroundColor="darkGray">
			<UIBasics.Header
				backgroundColor="blue"
				textAlign="center">
				Effects
			</UIBasics.Header>
			<UIBasics.Box
				backgroundColor="gray"
				flexDirection="row"
				justifyContent="space-between">
				<UIBasics.Text
					textAlign="center"
					textColor="blue"
					children={`Effects: ${effectsInOrder.length}`}
				/>
				<EffectActionButtonsContainer>
					{genericEffects.length >= 2 && (
						<ReorderEffects
							effects={genericEffects}
							pathname={pathname}
							targetId={targetId}
							targetType={targetType}
							revalidatePath={revalidatePath}
						/>
					)}
					<LinkEffect
						pathname={pathname}
						targetId={targetId}
						targetType={targetType}
						revalidatePath={revalidatePath}
					/>
					<CreateEffect
						pathname={pathname}
						targetId={targetId}
						targetType={targetType}
						revalidatePath={revalidatePath}
					/>
				</EffectActionButtonsContainer>
			</UIBasics.Box>
			<UIBasics.Carousel
				// memoryId={`edit-${targetType}-${targetId}`}
				slidesOrigin={"center"}
				slides={effectsInOrder.length}
				slidesPerView={1}
				slideChilds={effectsInOrder.map((genericEffect) => (
					<GenericEffectEditor
						key={genericEffect.id}
						genericEffect={genericEffect}
						pathname={pathname}
						revalidatePath={revalidatePath}
					/>
				))}
			/>
		</UIBasics.Box>
	);
}

"use client";

import { UIBasics } from "@/components/(UIBasics)";
import { HookedForm } from "@/libs/stp@forms";
import { GenericEffect, Guid } from "@/libs/stp@types";
import { GenericEffectEditor } from "./subComponents/GenericEffectEditor";

interface EntityEffectsEditorProps {
	targetId: Guid;
	targetType: "Item";
	genericEffects: GenericEffect[];
}
export function EntityEffectsEditor({
	genericEffects,
}: EntityEffectsEditorProps) {
	const effectsInOrder = genericEffects.sort((e1, e2) => e1.order - e2.order);

	return (
		<UIBasics.Carousel
			slidesOrigin={"center"}
			slides={effectsInOrder.length}
			slidesPerView={1}
			slideChilds={effectsInOrder.map((genericEffect) => (
				<GenericEffectEditor
					key={genericEffect.id}
					genericEffect={genericEffect}
				/>
			))}
		/>
	);
}

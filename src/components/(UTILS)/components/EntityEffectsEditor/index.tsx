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
import { FastCreateEffect } from "./subComponents/FastCreateEffect";
import { useEffect, useRef, useState } from "react";
import { StpIcon } from "@/libs/stp@icons";

const EditorChangeButton = newStyledElement.button(styles.editorChangeButton);
const HeaderSubContainer = newStyledElement.div(styles.headerSubContainer);
const EffectActionButtonsContainer = newStyledElement.div(
	styles.effectActionButtonsContainer,
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
	defaultEffectName?: string;
}
export function EntityEffectsEditor({
	targetId,
	targetType,
	genericEffects,
	defaultEffectName,
}: EntityEffectsEditorProps) {
	const pathname = usePathname();
	const effectsInOrder = genericEffects.sort((e1, e2) => e1.order - e2.order);
	const [activeEditorIndex, setActiveEditorIndex] = useState<number>(0);
	const activeEditorRef = useRef<HTMLFormElement | null>(null);
	const [shouldFocusOnLastEditor, setShouldFocusOnLastEditor] = useState(false);

	function nextEditor() {
		let nextIndex = activeEditorIndex + 1;
		if (nextIndex >= effectsInOrder.length) nextIndex = 0;
		setActiveEditorIndex(nextIndex);
	}
	function previousEditor() {
		let previousIndex = activeEditorIndex - 1;
		if (previousIndex < 0) previousIndex = effectsInOrder.length - 1;
		setActiveEditorIndex(previousIndex);
	}

	useEffect(() => {
		if (activeEditorIndex > effectsInOrder.length - 1)
			setActiveEditorIndex(effectsInOrder.length - 1);
	}, [effectsInOrder]);
	useEffect(() => {
		if (shouldFocusOnLastEditor == false) return;
		setActiveEditorIndex(effectsInOrder.length);
		setTimeout(() => {
			if (activeEditorRef.current)
				(
					activeEditorRef.current?.childNodes[2].childNodes[1].childNodes[0]
						.childNodes[0].childNodes[0].childNodes[1]
						.childNodes[1] as HTMLTextAreaElement
				).focus();
		}, 650);
		setShouldFocusOnLastEditor(false);
	}, [shouldFocusOnLastEditor]);

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
				<HeaderSubContainer>
					<EditorChangeButton
						onClick={previousEditor}
						disabled={effectsInOrder.length < 2}>
						<StpIcon
							name="ArrowLeft"
							style="bold"
						/>
					</EditorChangeButton>
					<UIBasics.Text
						textAlign="center"
						textColor="blue"
						children={`Effects: ${activeEditorIndex + 1} / ${effectsInOrder.length}`}
					/>
				</HeaderSubContainer>
				<HeaderSubContainer>
					<EffectActionButtonsContainer>
						{genericEffects.length >= 2 && (
							<ReorderEffects
								effects={genericEffects}
								pathname={pathname}
								targetId={targetId}
								targetType={targetType}
							/>
						)}
						<LinkEffect
							pathname={pathname}
							targetId={targetId}
							targetType={targetType}
						/>
						<CreateEffect
							pathname={pathname}
							targetId={targetId}
							targetType={targetType}
							defaultName={defaultEffectName}
							setShouldFocusOnLastEditor={setShouldFocusOnLastEditor}
						/>
						<FastCreateEffect
							pathname={pathname}
							targetId={targetId}
							targetType={targetType}
							name={defaultEffectName ?? "Efeito"}
							setShouldFocusOnLastEditor={setShouldFocusOnLastEditor}
						/>
					</EffectActionButtonsContainer>
					<EditorChangeButton
						onClick={nextEditor}
						disabled={effectsInOrder.length < 2}>
						<StpIcon
							name="ArrowRight"
							style="bold"
						/>
					</EditorChangeButton>
				</HeaderSubContainer>
			</UIBasics.Box>
			{effectsInOrder.length > 0 &&
				activeEditorIndex < effectsInOrder.length && (
					<GenericEffectEditor
						formRef={activeEditorRef}
						key={effectsInOrder[activeEditorIndex].id}
						genericEffect={effectsInOrder[activeEditorIndex]}
						pathname={pathname}
					/>
				)}
		</UIBasics.Box>
	);
}

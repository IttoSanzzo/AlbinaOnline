"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import React, { Dispatch, SetStateAction } from "react";
import styles from "./styles.module.css";

const SwitchInternalContainer = newStyledElement.div(
	styles.switchInternalContainer,
);
const SwitchButton = newStyledElement.button(styles.switchButton);

interface StateSwitchProps {
	label: string;
	state: [boolean, Dispatch<SetStateAction<boolean>>];
	disabled?: boolean;
	style?: React.CSSProperties;
	onClickCheck?: (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => Promise<boolean>;
	className?: string;
}
export function StateSwitch({
	label,
	state,
	disabled,
	style,
	onClickCheck,
	className,
}: StateSwitchProps) {
	async function handleClick(
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) {
		if (!onClickCheck || (await onClickCheck(event))) state[1](!state[0]);
	}
	return (
		<SwitchButton
			className={className}
			onClick={handleClick}
			disabled={disabled}
			style={style}>
			<SwitchInternalContainer>
				<label>{label}</label>
				<div>
					<span className={state[0] ? styles.stateTrue : styles.stateFalse} />
				</div>
			</SwitchInternalContainer>
		</SwitchButton>
	);
}

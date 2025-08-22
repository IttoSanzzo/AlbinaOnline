"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import React, { Dispatch, SetStateAction } from "react";
import styles from "./styles.module.css";

const SwitchInternalContainer = newStyledElement.div(
	styles.switchInternalContainer
);
const SwitchButton = newStyledElement.button(styles.switchButton);

interface StateSwitchProps {
	label: string;
	state: [boolean, Dispatch<SetStateAction<boolean>>];
	disabled?: boolean;
	style?: React.CSSProperties;
}
export function StateSwitch({
	label,
	state,
	disabled,
	style,
}: StateSwitchProps) {
	function handleClick() {
		state[1](!state[0]);
	}
	return (
		<SwitchButton
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

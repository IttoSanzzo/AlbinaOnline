"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import React, { Dispatch, SetStateAction } from "react";
import styles from "./styles.module.css";
import clsx from "clsx";

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
	iconTrueClassName?: string;
	iconFalseClassName?: string;
}
export function StateSwitch({
	label,
	state,
	disabled,
	style,
	onClickCheck,
	className,
	iconFalseClassName,
	iconTrueClassName,
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
					<span
						className={
							state[0]
								? clsx(styles.stateTrue, iconTrueClassName)
								: clsx(styles.stateFalse, iconFalseClassName)
						}
					/>
				</div>
			</SwitchInternalContainer>
		</SwitchButton>
	);
}

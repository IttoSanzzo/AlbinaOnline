"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import { RadialMenuOption } from "../types";
import styles from "./DefaultRadialMenuCore.module.css";

const Container = newStyledElement.div(styles.container);
const Description = newStyledElement.div(styles.description);
const Icon = newStyledElement.div(styles.icon);
const Name = newStyledElement.div(styles.name);
const Meta = newStyledElement.div(styles.meta);
const Submenu = newStyledElement.div(styles.submenu);
const FastKey = newStyledElement.div(styles.fastKey);
const EmptyState = newStyledElement.div(styles.emptyState);
const EmptyIcon = newStyledElement.div(styles.emptyIcon);
const EmptyTitle = newStyledElement.div(styles.emptyTitle);
const EmptyDescription = newStyledElement.div(styles.emptyDescription);
const Hint = newStyledElement.div(styles.hint);

interface DefaultRadialMenuCoreProps {
	name: string;
	option?: RadialMenuOption;
}
export function DefaultRadialMenuCore({
	name = "Radial Menu",
	option,
}: DefaultRadialMenuCoreProps) {
	const hasChildren = Boolean(option?.options?.length);

	return (
		<Container>
			{option ? (
				<>
					<Icon>{option.icon}</Icon>
					<Name>{option.name}</Name>
					{option.description && (
						<Description>{option.description}</Description>
					)}
					<Meta>
						{hasChildren && <Submenu>Submenu</Submenu>}
						{option.fastKey && (
							<FastKey>{option.fastKey.toUpperCase()}</FastKey>
						)}
					</Meta>
				</>
			) : (
				<EmptyState>
					<EmptyIcon>✦</EmptyIcon>
					<EmptyTitle>{name}</EmptyTitle>
					<EmptyDescription>Selecione uma opção</EmptyDescription>
				</EmptyState>
			)}
			<Hint>
				<span>RMB</span>
				<span>cancelar</span>
			</Hint>
		</Container>
	);
}

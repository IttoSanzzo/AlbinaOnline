"use client";

import { Dialog } from "@/libs/stp@radix";
import styles from "./index.module.css";
import { useState } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import { StpIcon } from "@/libs/stp@icons";
import { Guid } from "@/libs/stp@types";
import { AllGridMapsViewer } from "./AllGridMapsViewer";
import { GridMapsEditor } from "./GridMapsEditor";

const TriggerTypeOne = newStyledElement.div(styles.triggerTypeOne);
const TriggerTypeTwo = newStyledElement.div(styles.triggerTypeTwo);

interface GridMapsModalProps {
	triggerButton?: "typeOne" | "typeTwo";
}
export function GridMapsModal({
	triggerButton = "typeOne",
}: GridMapsModalProps) {
	const [openState, setOpenState] = useState<boolean>(false);
	const [editingGridMapId, setEditingGridMapId] = useState<Guid | null>(null);

	return (
		<Dialog.Root
			onOpenChange={setOpenState}
			open={openState}>
			<Dialog.Trigger asChild>
				{triggerButton == "typeOne" ? (
					<TriggerTypeOne>
						<StpIcon name="MapTrifold" />
					</TriggerTypeOne>
				) : (
					<TriggerTypeTwo></TriggerTypeTwo>
				)}
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay onClick={() => setOpenState(false)} />
				<Dialog.Content className={styles.content}>
					<Dialog.Title />
					<Dialog.Description />
					{editingGridMapId == null ? (
						<AllGridMapsViewer setEditingGridMapId={setEditingGridMapId} />
					) : (
						<GridMapsEditor setEditingGridMapId={setEditingGridMapId} />
					)}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

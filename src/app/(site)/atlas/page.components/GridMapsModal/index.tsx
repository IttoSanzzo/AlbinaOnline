"use client";

import { Dialog } from "@/libs/stp@radix";
import styles from "./index.module.css";
import { useState } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import { StpIcon } from "@/libs/stp@icons";
import { Guid } from "@/libs/stp@types";
import { AllGridMapsViewer } from "./AllGridMapsViewer";
import { GridMapsEditor } from "./GridMapsEditor";

const Trigger = newStyledElement.div(styles.trigger);

interface GridMapsModalProps {
	isInVtt?: boolean;
}
export function GridMapsModal({ isInVtt = false }: GridMapsModalProps) {
	const [openState, setOpenState] = useState<boolean>(false);
	const [editingGridMapId, setEditingGridMapId] = useState<Guid | null>(null);

	function handleOpenStateChange(newState: boolean) {
		if (editingGridMapId != null) setEditingGridMapId(null);
		setOpenState(newState);
	}

	return (
		<Dialog.Root
			onOpenChange={handleOpenStateChange}
			open={openState}>
			<Dialog.Trigger asChild>
				<Trigger className={isInVtt ? styles.insideVtt : styles.outsideVtt}>
					<StpIcon name="MapTrifold" />
				</Trigger>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay onClick={() => handleOpenStateChange(false)} />
				<Dialog.Content className={styles.content}>
					<Dialog.Title />
					<Dialog.Description />
					{editingGridMapId == null ? (
						<AllGridMapsViewer
							isInVtt={isInVtt}
							setEditingGridMapId={setEditingGridMapId}
						/>
					) : (
						<GridMapsEditor
							gridMapId={editingGridMapId}
							setEditingGridMapId={setEditingGridMapId}
						/>
					)}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

"use client";

import { StpIcon } from "@/libs/stp@icons";
import styles from "./GridMapsCreator.module.css";
import { Guid } from "@/libs/stp@types";
import { newStyledElement } from "@setsu-tp/styled-components";
import { Dispatch, SetStateAction, useState } from "react";
import { Dialog } from "@/libs/stp@radix";
import { GridMapsCreationForm } from "./GridMapsCreationForm";
import clsx from "clsx";

const GridMapsCreatorTrigger = newStyledElement.div(
	styles.gridMapsCreatorTrigger,
);

interface GridMapsCreatorProps {
	setEditingGridMapId: Dispatch<SetStateAction<Guid | null>>;
	isInVtt: boolean;
}
export function GridMapsCreator({
	setEditingGridMapId,
	isInVtt,
}: GridMapsCreatorProps) {
	const [openState, setOpenState] = useState<boolean>(false);

	return (
		<Dialog.Root
			open={openState}
			onOpenChange={setOpenState}>
			<Dialog.Trigger asChild>
				<GridMapsCreatorTrigger
					className={isInVtt ? styles.isInVtt : undefined}>
					<StpIcon
						name={"PlusCircle"}
						color={"blue"}
					/>
				</GridMapsCreatorTrigger>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay
					onClick={() => setOpenState(false)}
					className={isInVtt ? styles.isInVtt : undefined}
				/>
				<Dialog.Content
					className={clsx(
						styles.content,
						isInVtt ? styles.isInVtt : undefined,
					)}>
					<Dialog.Title />
					<Dialog.Description />
					<GridMapsCreationForm
						setEditingGridMapId={setEditingGridMapId}
						setCreatorOpenState={setOpenState}
					/>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

"use client";

import styles from "./GridMapInteractionModal.module.css";
import { Guid, RoleHierarchy } from "@/libs/stp@types";
import { newStyledElement } from "@setsu-tp/styled-components";
import { Dispatch, SetStateAction, useState } from "react";
import { Dialog } from "@/libs/stp@radix";
import { GridMap } from "@/libs/stp@types/dataTypes/gridMap";
import { GridMapCard } from "./GridMapCard";
import { useCurrentUser } from "@/libs/stp@hooks";
import { StateSwitch } from "@/components/(UTILS)";
import { DEFAULT_MOCK_GRID_COLORS, GridMapGridViewer } from "./MockGrid";
import { useLocalStorageState } from "@/utils/Storage";

const Footer = newStyledElement.div(styles.footer);
const EditButton = newStyledElement.div(styles.editButton);

interface GridMapInteractionModalProps {
	setEditingGridMapId: Dispatch<SetStateAction<Guid | null>>;
	gridMap: GridMap;
	isInVtt: boolean;
}
export function GridMapInteractionModal({
	setEditingGridMapId,
	gridMap,
	isInVtt,
}: GridMapInteractionModalProps) {
	const [openState, setOpenState] = useState<boolean>(false);
	const [gridColors] = useLocalStorageState(
		"grid-map-viewer-colors",
		DEFAULT_MOCK_GRID_COLORS,
	);
	const withGridState = useState<boolean>(true);
	const { user } = useCurrentUser();

	return (
		<Dialog.Root
			open={openState}
			onOpenChange={setOpenState}>
			<Dialog.Trigger
				className={styles.trigger}
				onClick={() => setOpenState(true)}>
				<GridMapCard gridMap={gridMap} />
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay onClick={() => setOpenState(false)} />
				<Dialog.Content className={styles.content}>
					<GridMapGridViewer
						gridMap={gridMap}
						showGrid={withGridState[0]}
						primaryColor={gridColors.primary}
						secondaryColor={gridColors.secondary}
					/>

					{((user != null && RoleHierarchy[user.role] >= RoleHierarchy.Admin) ||
						isInVtt) && (
						<Footer>
							{user != null && RoleHierarchy[user.role] && (
								<EditButton
									data-cursor-hover-interaction-type="Pointer"
									onClick={() => {
										setEditingGridMapId(gridMap.id);
									}}>
									Editar
								</EditButton>
							)}
							{isInVtt && (
								<div data-cursor-hover-interaction-type="Pointer">
									Add to Vtt
								</div>
							)}
						</Footer>
					)}

					<StateSwitch
						label={"Grid"}
						state={withGridState}
						className={styles.gridSwitch}
					/>
					<Dialog.Title style={{ display: "none" }} />
					<Dialog.Description style={{ display: "none" }} />
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./index.module.css";
import { useLocalStorageState } from "@/utils/Storage";
import { Dispatch, SetStateAction } from "react";
import { setVttElementHoverInteraction } from "../../../../Utils/ElementDataAttributeUtils";
import clsx from "clsx";
import { TokenRosterTabContent } from "./Rooster";
import { TokenCreatorTabContent } from "./Create";

const TokenLayerTabContainer = newStyledElement.div(
	styles.tokenLayerTabContainer,
);
const ToolSelectionContainer = newStyledElement.div(
	styles.toolSelectionContainer,
);
const ToolSelectionButtonElement = newStyledElement.button(
	styles.toolSelectionButton,
);
const TabSelectedToolContainer = newStyledElement.div(
	styles.tabSelectedToolContainer,
);

export function TokenLayerTab() {
	const toolTypeState = useLocalStorageState<"Roster" | "Create" | null>(
		"vtt-right-tab-token-layer-tool-selector",
		"Roster",
		{ temporaryValue: null },
	);

	if (toolTypeState[0] == null) return null;
	return (
		<TokenLayerTabContainer>
			<ToolSelectionContainer>
				<ToolSelectionButton
					state={toolTypeState}
					type={"Roster"}
				/>
				<ToolSelectionButton
					state={toolTypeState}
					type={"Create"}
				/>
			</ToolSelectionContainer>
			<TabSelectedToolContainer>
				{toolTypeState[0] == "Roster" ? (
					<TokenRosterTabContent />
				) : (
					<TokenCreatorTabContent />
				)}
			</TabSelectedToolContainer>
		</TokenLayerTabContainer>
	);
}

interface ToolSelectionButtonProps {
	state: [
		"Roster" | "Create" | null,
		Dispatch<SetStateAction<"Roster" | "Create" | null>>,
	];
	type: "Roster" | "Create";
}
function ToolSelectionButton({
	state: [toolType, setToolType],
	type,
}: ToolSelectionButtonProps) {
	return (
		<ToolSelectionButtonElement
			{...setVttElementHoverInteraction("Pointer")}
			className={clsx(
				toolType == type ? styles.isActive : undefined,
				styles[type],
			)}
			onClick={() => {
				if (toolType != type) setToolType(type);
			}}>
			{type == "Roster" ? "Roster" : "Criar"}
		</ToolSelectionButtonElement>
	);
}

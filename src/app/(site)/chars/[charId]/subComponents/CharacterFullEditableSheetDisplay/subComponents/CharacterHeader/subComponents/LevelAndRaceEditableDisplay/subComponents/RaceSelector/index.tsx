import { Dialog } from "@/libs/stp@radix";
import { Guid, RaceData } from "@/libs/stp@types";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StpIcon } from "@/libs/stp@icons";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Dispatch, SetStateAction } from "react";
import { RaceSelectionCore } from "./subComponents/RaceSelectionCore";

const ButtonContainer = newStyledElement.div(styles.buttonContainer);
const AddButton = newStyledElement.div(styles.addButton);

interface RaceSelectorProps {
	characterId: Guid;
	race: RaceData;
	setRace: Dispatch<SetStateAction<RaceData>>;
}
export function RaceSelector({
	characterId,
	race,
	setRace,
}: RaceSelectorProps) {
	return (
		<ButtonContainer>
			<Dialog.Root>
				<Dialog.Trigger asChild>
					<AddButton>{StpIcon({ name: "Swap" })}</AddButton>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay>
						<Dialog.Content maxWidth={1000}>
							<DialogDescription />
							<Dialog.Title
								children={"Trocar Raça"}
								marginBottom={20}
								textAlign="center"
							/>
							<RaceSelectionCore
								characterId={characterId}
								raceState={race}
								setRaceState={setRace}
							/>
						</Dialog.Content>
					</Dialog.Overlay>
				</Dialog.Portal>
			</Dialog.Root>
		</ButtonContainer>
	);
}

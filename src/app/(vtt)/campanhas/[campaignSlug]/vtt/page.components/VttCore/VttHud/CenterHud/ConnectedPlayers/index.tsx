import styles from "./index.module.css";
import { newStyledElement } from "@setsu-tp/styled-components";
import { useVttMembersContext } from "../../../../Contexts/VttMembersProvider";
import { CompactPlayerIndicator } from "./Components/CompactPlayerIndicator";
import { useCurrentCampaignMember } from "@/libs/stp@hooks";
import { CurrentPlayerCharacterIndicator } from "./CurrentPlayerCharacterIndicator";

const ConnectedPlayersContainer = newStyledElement.div(
	styles.connectedPlayersContainer,
);
const ActivePlayerIndicatorsContainer = newStyledElement.div(
	styles.activePlayerIndicatorsContainer,
);
const PlayerIndicatorsContainer = newStyledElement.div(
	styles.playerIndicatorsContainer,
);

export function ConnectedPlayers() {
	const members = useVttMembersContext((state) => state.members);
	const connectedUserIds = useVttMembersContext(
		(state) => state.connectedUserIds,
	);
	const currentMember = useCurrentCampaignMember();

	const sortedOtherMembers = [...members]
		.filter((member) => member.id !== currentMember.member?.id)
		.sort((a, b) => {
			const aConnected = connectedUserIds.has(a.userId);
			const bConnected = connectedUserIds.has(b.userId);

			if (aConnected !== bConnected)
				return Number(bConnected) - Number(aConnected);

			if (a.isMaster !== b.isMaster)
				return Number(b.isMaster) - Number(a.isMaster);

			return a.user.nickname.localeCompare(b.user.nickname, undefined, {
				sensitivity: "base",
			});
		});

	const currentExpandedMember = members.find(
		(member) => member.id === currentMember.member?.id,
	);

	return (
		<ConnectedPlayersContainer>
			<ActivePlayerIndicatorsContainer>
				{currentExpandedMember && (
					<CurrentPlayerCharacterIndicator member={currentExpandedMember} />
				)}
			</ActivePlayerIndicatorsContainer>
			<PlayerIndicatorsContainer>
				{sortedOtherMembers.map((member) => (
					<CompactPlayerIndicator
						key={member.id}
						member={member}
					/>
				))}
			</PlayerIndicatorsContainer>
		</ConnectedPlayersContainer>
	);
}

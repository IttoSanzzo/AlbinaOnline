import { useVttMembersContext } from "../../../../Contexts/VttMembersProvider";
import { CompactPlayerIndicator } from "./Components/CompactPlayerIndicator";

export function ConnectedPlayers() {
	const members = useVttMembersContext((state) => state.members);

	return (
		<div>
			{members.map((member) => (
				<CompactPlayerIndicator
					key={member.id}
					member={member}
				/>
			))}
		</div>
	);
}

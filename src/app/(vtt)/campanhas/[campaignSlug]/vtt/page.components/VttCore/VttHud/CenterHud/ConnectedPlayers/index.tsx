import { useVttMembersContext } from "../../../../Contexts/VttMembersProvider";
import { useVttVoiceStore } from "../../../../Contexts/VttVoiceContextProvider";

export function ConnectedPlayers() {
	const members = useVttMembersContext((state) => state.members);

	const voiceStates = useVttVoiceStore((state) => state.voiceStates);
	// const voiceState = useVttVoiceStore((state) => state.getVoiceState(albinaId));

	// console.log(voiceState);

	return (
		<div>
			{members.map((member) => (
				<div key={member.userId}>
					{voiceStates.get(member.userId) ? (
						<pre>
							{member.user.nickname}{" "}
							{JSON.stringify(voiceStates.get(member.userId), null, 2)}
						</pre>
					) : (
						"NotFound"
					)}
				</div>
			))}
		</div>
	);
}

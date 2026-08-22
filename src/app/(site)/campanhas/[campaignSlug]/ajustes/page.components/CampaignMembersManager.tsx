import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./CampaignMembersManager.module.css";
import { useEffect, useState } from "react";
import { Campaign, CampaignMember } from "@/libs/stp@types";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { UIBasics } from "@/components/(UIBasics)";
import { MemberEntry } from "./CampaignMembersManager.components/MemberEntry";

const CampaignMembersManagerContainer = newStyledElement.div(
	styles.campaignMembersManagerContainer,
);
const MembersList = newStyledElement.div(styles.membersList);

interface CampaignMembersManagerProps {
	campaign: Campaign;
	currentMember: CampaignMember;
}
export function CampaignMembersManager({
	campaign,
	currentMember,
}: CampaignMembersManagerProps) {
	const [members, setMembers] = useState<CampaignMember[]>([]);

	useEffect(() => {
		(async () => {
			const response = await authenticatedFetchAsync(
				`/campaigns/${campaign.slug}/members?expandUser=true`,
			);
			if (!response.ok) return;
			setMembers(await response.json());
		})();
	}, [campaign, setMembers]);

	function getPriority(member: CampaignMember) {
		if (member.userId === currentMember.userId) return 0;
		if (member.isMaster) return 1;
		return 2;
	}

	return (
		<CampaignMembersManagerContainer>
			<UIBasics.Header textColor="gray">
				Membros{" "}
				{`${campaign.masterCount} (${campaign.playerCount}${campaign.maxPlayers > 0 ? ` / ${campaign.maxPlayers}` : ""})`}
			</UIBasics.Header>
			<MembersList>
				{members
					.sort((a, b) => {
						const priorityDifference = getPriority(a) - getPriority(b);
						if (priorityDifference !== 0) return priorityDifference;

						return a.user.nickname.localeCompare(b.user.nickname, "pt-BR", {
							sensitivity: "base",
						});
					})
					.map((member) => (
						<MemberEntry
							key={member.id}
							campaign={campaign}
							member={member}
							isCurrent={member.id == currentMember.id}
						/>
					))}
			</MembersList>
		</CampaignMembersManagerContainer>
	);
}

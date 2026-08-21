import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./CampaignInvitesManager.module.css";
import { useEffect, useState } from "react";
import { CampaignInvite } from "@/libs/stp@types";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { UIBasics } from "@/components/(UIBasics)";
import { CreateNewInvite } from "./CampaignInvitesManager.components/CreateNewInvite";
import { InviteEntry } from "./CampaignInvitesManager.components/InviteEntry";

const CampaignInvitesManagerContainer = newStyledElement.div(
	styles.campaignInvitesManagerContainer,
);
const InvitesList = newStyledElement.div(styles.invitesList);
const NoInvites = newStyledElement.div(styles.noInvites);

interface CampaignInvitesManagerProps {
	campaignSlug: string;
}
export function CampaignInvitesManager({
	campaignSlug,
}: CampaignInvitesManagerProps) {
	const [invites, setInvites] = useState<CampaignInvite[]>([]);

	useEffect(() => {
		(async () => {
			const response = await authenticatedFetchAsync(
				`/campaigns/${campaignSlug}/invites`,
			);
			if (!response.ok) return;
			setInvites(await response.json());
		})();
	}, [campaignSlug, setInvites]);

	return (
		<CampaignInvitesManagerContainer>
			<UIBasics.Header textColor="gray">Convites</UIBasics.Header>
			{invites.length == 0 ? (
				<NoInvites>
					<UIBasics.Text
						textColor="gray"
						textAlign="center">
						Não há convites criados
					</UIBasics.Text>
				</NoInvites>
			) : (
				<InvitesList>
					{invites
						.sort(
							(a, b) =>
								new Date(b.createdAt).getTime() -
								new Date(a.createdAt).getTime(),
						)
						.map((invite) => (
							<InviteEntry
								key={invite.id}
								campaignSlug={campaignSlug}
								invite={invite}
								setInvites={setInvites}
							/>
						))}
				</InvitesList>
			)}
			<CreateNewInvite
				campaignSlug={campaignSlug}
				setInvites={setInvites}
			/>
		</CampaignInvitesManagerContainer>
	);
}

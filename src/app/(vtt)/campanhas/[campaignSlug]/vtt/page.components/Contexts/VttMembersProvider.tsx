"use client";

import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { CampaignMember, Guid } from "@/libs/stp@types";
import { useVttContext } from "./VttContextProvider";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
interface VttMembersContext {
	members: CampaignMember[];
	connectedUserIds: Set<Guid>;
	isUserConnected: (userId: Guid) => boolean;
}

const VttMembersContext = createContext<VttMembersContext | null>(null);

interface VttMembersContextProviderProps {
	children: ReactNode;
}
export function VttMembersContextProvider({
	children,
}: VttMembersContextProviderProps) {
	const { vttId, campaign, subscribe } = useVttContext();

	const [members, setMembers] = useState<CampaignMember[]>([]);
	const [connectedUserIds, setConnectedUserIds] = useState<Set<Guid>>(
		new Set(),
	);

	useEffect(() => {
		if (!vttId) return;

		setMembers([]);
		setConnectedUserIds(new Set());

		(async () => {
			const response = await fetch(
				getAlbinaApiFullAddress(
					`/campaigns/${campaign.slug}/members?expandUser=true`,
				),
			);
			if (!response.ok) return;
			setMembers(await response.json());
		})();

		return subscribe("ConnectedUserIds", (message) => {
			setConnectedUserIds(new Set(message.data as Guid[]));
		});
	}, [vttId, subscribe]);

	const isUserConnected = (userId: Guid) => connectedUserIds.has(userId);
	const contextValue: VttMembersContext = {
		members,
		connectedUserIds,
		isUserConnected,
	};

	return (
		<VttMembersContext.Provider value={contextValue}>
			{children}
		</VttMembersContext.Provider>
	);
}

export function useVttMembersContext(): VttMembersContext {
	const context = useContext(VttMembersContext);

	if (!context)
		throw new Error(
			"useVttMembersContext must be used inside a VttMembersContextProvider.",
		);

	return context;
}

"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./index.module.css";
import { useVttWebSocket } from "@/libs/stp@hooks/hooks/useVttWebSocket";
import { VttContextProvider } from "../Contexts/VttContextProvider";
import { CursorSyncronizer } from "./CursorSyncronizer";
import { VttMembersContextProvider } from "../Contexts/VttMembersProvider";
import { Campaign } from "@/libs/stp@types";

const VttCoreContainer = newStyledElement.div(styles.vttCoreContainer);

interface VttCoreProps {
	campaign: Campaign;
}
export function VttCore({ campaign }: VttCoreProps) {
	const { vttId } = useVttWebSocket();

	return (
		<VttCoreContainer>
			<VttContextProvider campaign={campaign}>
				<VttMembersContextProvider>
					{`Connected to VttId: ${vttId}`}
					<CursorSyncronizer />
				</VttMembersContextProvider>
			</VttContextProvider>
		</VttCoreContainer>
	);
}

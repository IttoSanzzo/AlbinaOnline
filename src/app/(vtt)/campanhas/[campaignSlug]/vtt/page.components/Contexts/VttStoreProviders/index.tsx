import { memo, ReactNode } from "react";
import { VttGridMapStoreProvider } from "../../Stores/VttGridMapStore";
import { VttGridMapStoreSync } from "../../Stores/VttGridMapStore.Sync";
import { VttTokenStoreProvider } from "../../Stores/VttTokenStore";
import { VttTokenStoreSync } from "../../Stores/VttTokenStore.Sync";

interface VttStoreProvidersProps {
	children: ReactNode;
}
export const VttStoreProviders = memo(function VttStoreProviders({
	children,
}: VttStoreProvidersProps) {
	return (
		<VttGridMapStoreProvider>
			<VttGridMapStoreSync />
			<VttTokenStoreProvider>
				<VttTokenStoreSync />
				{children}
			</VttTokenStoreProvider>
		</VttGridMapStoreProvider>
	);
});

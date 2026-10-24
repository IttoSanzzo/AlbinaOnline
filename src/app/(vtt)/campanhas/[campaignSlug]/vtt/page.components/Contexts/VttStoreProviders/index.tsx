import { memo, ReactNode } from "react";
import { VttGridMapStoreProvider } from "../../Stores/VttGridMapStore";
import { VttGridMapStoreSync } from "../../Stores/VttGridMapStore.Sync";

interface VttStoreProvidersProps {
	children: ReactNode;
}
export const VttStoreProviders = memo(function VttStoreProviders({
	children,
}: VttStoreProvidersProps) {
	return (
		<VttGridMapStoreProvider>
			<VttGridMapStoreSync />
			{children}
		</VttGridMapStoreProvider>
	);
});

import { Toaster } from "@/components/(HUD)";
import { ReactNode } from "react";

interface AppProps {
	children: ReactNode;
}

export async function App({ children }: AppProps) {
	return (
		<>
			{children}
			<Toaster />
		</>
	);
}

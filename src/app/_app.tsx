import { ReactNode } from "react";

interface AppProps {
	children: ReactNode;
}

export function App({ children }: AppProps) {
	return <>{children}</>;
}

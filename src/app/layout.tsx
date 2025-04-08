import type { Metadata } from "next";
import { App } from "./_app";
import "@/styles/global.css";

export const metadata: Metadata = {
	title: "Albina Alpha1",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<App>{children}</App>
			</body>
		</html>
	);
}

import type { Metadata } from "next";
import { App } from "./_app";
import "@/styles";

import { Inter, Roboto, Roboto_Mono, Space_Mono } from "next/font/google";
import clsx from "clsx";

const inter = Inter({
	subsets: ["latin"],
});
const roboto = Roboto({ subsets: ["latin"] });
const robotoMono = Roboto_Mono({ subsets: ["latin"] });
const spaceMono = Space_Mono({
	subsets: ["latin"],
	weight: ["400", "700"],
});

export const metadata: Metadata = {
	title: "Albina RPG",
	icons: {
		icon: "/favicon.ico",
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={clsx(
				inter.className,
				roboto.className,
				robotoMono.className,
				spaceMono.className
			)}>
			<head></head>
			<body>
				<App>{children}</App>
			</body>
		</html>
	);
}

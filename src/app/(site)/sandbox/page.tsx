import { StyledLink } from "@/components/(Design)";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
	title: "Sandbox",
};

export default async function SandBox() {
	if (process.env.NODE_ENV === "production") return notFound();
	return (
		<>
			<StyledLink
				href="/redirect/notion-link/279b1b1c-8baa-80f3-a80d-c860042f1b1d?database=codex"
				title="Teste"
				usePreview={true}
			/>
		</>
	);
}

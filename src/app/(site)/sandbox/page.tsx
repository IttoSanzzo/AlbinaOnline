import { assembleMetadata } from "@/metadata/assembleMetadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import SandboxPageContent from "./pageContent";

export const metadata: Metadata = assembleMetadata({
	title: "Sandbox",
	route: "/sandbox",
});

export default async function SandBoxServerShell() {
	if (process.env.NODE_ENV === "production") return notFound();
	return <SandboxPageContent />;
}

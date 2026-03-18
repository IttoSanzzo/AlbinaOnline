import { assembleMetadata } from "@/metadata/assembleMetadata";
import { Metadata } from "next";
import { AlbinaBroadcast } from "./subComponents/AlbinaBroadcast";
import "./styles.css";

export const metadata: Metadata = assembleMetadata({
	title: "Albina Broadcast",
	route: "/embeds/broadcast",
});

interface BroadcastServerShellProps {
	searchParams: Promise<{
		size?: number | string;
	}>;
}
export default async function AlbinaBroadcastServerShell({
	searchParams,
}: BroadcastServerShellProps) {
	const { size } = await searchParams;
	return <AlbinaBroadcast size={size} />;
}

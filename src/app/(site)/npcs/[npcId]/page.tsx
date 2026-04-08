import { Metadata } from "next";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import NpcPageContent from "./pageContent";
import { Guid } from "@/libs/stp@types";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { MetadataData } from "@/libs/stp@types/otherTypes/MetadataData";

interface CharPageServerShellProps {
	params: Promise<{ npcId: Guid }>;
}

export async function generateMetadata({
	params,
}: CharPageServerShellProps): Promise<Metadata> {
	const { npcId } = await params;

	const response = await fetch(
		getAlbinaApiFullAddress(`/npcs/${npcId}/metadata`),
		{
			cache: "force-cache",
			method: "GET",
			next: {
				tags: [`page-metadata-char-${npcId}`],
			},
		},
	);
	if (!response.ok) {
		return assembleMetadata({
			title: "Npc Not Found",
		});
	}
	const data: MetadataData = await response.json();
	return assembleMetadata({
		title: data.title,
		description: data.description,
		icon: data.icon,
		ogImage: {
			url: data.ogImage,
		},
		route: `/npcs/${npcId}`,
	});
}

export default async function CharPageServerShell({
	params,
}: CharPageServerShellProps) {
	const { npcId } = await params;

	return <NpcPageContent npcId={npcId} />;
}

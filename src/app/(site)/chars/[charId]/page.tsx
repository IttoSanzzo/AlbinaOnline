import { Metadata } from "next";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import CharPageContent from "./pageContent";
import { Guid } from "@/libs/stp@types";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { MetadataData } from "@/libs/stp@types/otherTypes/MetadataData";

interface CharPageServerShellProps {
	params: Promise<{ charId: Guid }>;
}

export async function generateMetadata({
	params,
}: CharPageServerShellProps): Promise<Metadata> {
	const { charId } = await params;

	const response = await fetch(
		getAlbinaApiFullAddress(`/chars/${charId}/metadata`),
		{
			cache: "force-cache",
			method: "GET",
			next: {
				tags: [`page-metadata-char-${charId}`],
			},
		}
	);
	if (!response.ok) {
		return assembleMetadata({
			title: "Char Not Found",
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
		route: `/chars/${charId}`,
	});
}

export default async function CharPageServerShell({
	params,
}: CharPageServerShellProps) {
	const { charId } = await params;

	return <CharPageContent characterId={charId} />;
}

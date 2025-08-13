import { Metadata } from "next";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import CharPageContent from "./pageContent";
import { Guid } from "@/libs/stp@types";

interface CharPageServerShellProps {
	params: Promise<{ charId: Guid }>;
}

export async function generateMetadata({
	params,
}: CharPageServerShellProps): Promise<Metadata> {
	const { charId } = await params;

	const response = await fetch(
		getAlbinaApiAddress(`/chars/${charId}/metadata`),
		{
			cache: "force-cache",
			method: "GET",
			next: {
				tags: [`page-metadata-char-${charId}`],
			},
		}
	);
	if (!response.ok) {
		return {
			title: "Char?",
		};
	}
	const data = await response.json();
	return {
		title: data.title,
		icons: { icon: data.icon },
	};
}

export default async function CharPageServerShell({
	params,
}: CharPageServerShellProps) {
	const { charId } = await params;

	return <CharPageContent characterId={charId} />;
}

import { Guid } from "@/libs/stp@types";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { Metadata } from "next";
import { CharacterProfileEmbed } from "./subComponents/CharacterProfileEmbed";

interface CharacterProfileEmbedProps {
	params: Promise<{ charId: Guid }>;
	searchParams: Promise<{
		size?: number | string;
		reactiveId?: string;
		title?: string;
		withoutFrame?: boolean;
		fontSize?: string;
		invertReactive?: boolean;
		useLargeSideBars?: boolean;
	}>;
}

export async function generateMetadata({
	params,
}: CharacterProfileEmbedProps): Promise<Metadata> {
	const { charId } = await params;

	return assembleMetadata({
		title: "Character Profile",
		route: `/embeds/chars/${charId}/profile`,
	});
}

export default async function CharacterProfileEmbedServerShell({
	params,
	searchParams,
}: CharacterProfileEmbedProps) {
	const {
		size,
		reactiveId,
		title,
		withoutFrame,
		fontSize,
		invertReactive,
		useLargeSideBars,
	} = await searchParams;
	const { charId } = await params;

	return (
		<CharacterProfileEmbed
			size={size}
			charId={charId}
			title={title}
			reactiveId={reactiveId}
			withoutFrame={withoutFrame}
			fontSize={fontSize}
			invertReactive={invertReactive}
			useLargeSideBars={useLargeSideBars}
		/>
	);
}

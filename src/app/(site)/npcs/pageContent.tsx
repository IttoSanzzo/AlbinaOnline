"use client";

import { StyledOwnedLinkCard } from "@/components/(Design)/components/StyledOwnedLinkCard";
import { useCurrentUser, useUserFavorites } from "@/libs/stp@hooks";
import { NpcData } from "@/libs/stp@types";
import { useEffect, useState } from "react";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { UIBasics } from "@/components/(UIBasics)";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HookedForm } from "@/libs/stp@forms";
import { authenticatedFetchWithTTLCache } from "@/utils/FetchCommonTools";

const schema = z.object({
	filter: z.string().transform((filter) => filter.toLowerCase()),
});
type FormData = z.infer<typeof schema>;

export default function NpcsPageContent() {
	const [npcs, setNpcs] = useState<NpcData[] | null>(null);
	const { favorites, isLoading } = useUserFavorites();
	const currentUser = useCurrentUser();

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			filter: "",
		},
	});
	const filter = form.watch().filter.toLowerCase();

	useEffect(() => {
		authenticatedFetchWithTTLCache<{ npcs: NpcData[] | null }>(
			getAlbinaApiFullAddress("/npcs"),
			{
				next: { revalidate: 60 },
			},
			60 * 1000,
		).then(async (response) => {
			if (response.ok == false) return;
			setNpcs(
				response.data.npcs
					? response.data.npcs.sort((a, b) => a.name.localeCompare(b.name))
					: [],
			);
		});
	}, [setNpcs]);
	if (npcs === null) return null;
	if (npcs.length === 0) {
		return (
			<>
				<UIBasics.Header
					textAlign="center"
					textColor="gray"
					children="Você não possui npcs"
				/>
				<UIBasics.Header
					textAlign="center"
					textColor="gray"
					headerType="h3"
					children="...e nem acesso a algum npc de outro usuário."
				/>
			</>
		);
	}

	const filteredNpcs: NpcData[] =
		filter.length === 0
			? npcs
			: npcs.filter(
					(npc) =>
						npc.name.toLowerCase().includes(filter) ||
						npc.level === Number(filter),
				);

	const allFavoriteNpcs: NpcData[] = isLoading
		? []
		: (favorites?.character.flatMap((favorite) => {
				const npc = filteredNpcs.find((npc) => npc.id == favorite.target.id);
				return npc ? [npc] : [];
			}) ?? []);
	const allUserNpcs: NpcData[] = currentUser.loading
		? []
		: filteredNpcs.filter((npc) => npc.ownerId == currentUser.user?.id);

	return (
		<UIBasics.Box
			withoutPadding
			backgroundColor="darkGray">
			<HookedForm.Form form={form}>
				<HookedForm.TextInput<FormData>
					fieldName="filter"
					label="Filtro"
				/>
				{filteredNpcs.length === 0 && (
					<UIBasics.Header
						textAlign="center"
						textColor="gray"
						children="Nenhum Resultado"
					/>
				)}
			</HookedForm.Form>

			{allFavoriteNpcs.length !== 0 && (
				<>
					<UIBasics.Header
						textAlign="center"
						textColor="yellow"
						children={"Seus Favoritos"}
					/>
					<UIBasics.Box backgroundColor="yellow">
						<UIBasics.Carousel
							slidesOrigin={"center"}
							slidesSpacing={10}
							minWidth={150}
							memoryId={"Favorites"}
							slideChilds={allFavoriteNpcs.map((npc) => (
								<StyledOwnedLinkCard
									key={npc.id}
									ownerId={npc.ownerId}
									href={`/npcs/${npc.id}`}
									title={npc.name}
									artworkUrl={npc.iconUrl}
								/>
							))}
						/>
					</UIBasics.Box>
				</>
			)}
			{allUserNpcs.length !== 0 && (
				<>
					<UIBasics.Header
						textAlign="center"
						textColor="purple"
						children={"Seus Npcs"}
					/>
					<UIBasics.Box backgroundColor="purple">
						<UIBasics.Carousel
							slidesOrigin={"center"}
							slidesSpacing={10}
							minWidth={150}
							memoryId={"Owned"}
							slideChilds={allUserNpcs.map((npc) => (
								<StyledOwnedLinkCard
									key={npc.id}
									ownerId={npc.ownerId}
									href={`/npcs/${npc.id}`}
									title={npc.name}
									artworkUrl={npc.iconUrl}
								/>
							))}
						/>
					</UIBasics.Box>
				</>
			)}
			{filteredNpcs.length !== 0 && (
				<>
					<UIBasics.Header
						textAlign="center"
						textColor="darkGray"
						backgroundColor="darkGray"
						children={"Todos"}
					/>
					<UIBasics.List.Grid
						direction="row"
						backgroundColor="blue"
						columnWidth={150}>
						{filteredNpcs.map((npc) => (
							<StyledOwnedLinkCard
								key={npc.id}
								size={150}
								ownerId={npc.ownerId}
								href={`/npcs/${npc.id}`}
								title={npc.name}
								artworkUrl={npc.iconUrl}
								layout="rectangle"
							/>
						))}
					</UIBasics.List.Grid>
				</>
			)}
		</UIBasics.Box>
	);
}

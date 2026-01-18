"use client";

import { FullUser, RoleHierarchy } from "@/libs/stp@types";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { useEffect, useState } from "react";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { UIBasics } from "@/components/(UIBasics)";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HookedForm } from "@/libs/stp@forms";
import { StyledLinkCard } from "@/components/(Design)";

const schema = z.object({
	filter: z.string().transform((filter) => filter.toLowerCase()),
});
type FormData = z.infer<typeof schema>;

export default function UsersPageContent() {
	const [users, setUsers] = useState<FullUser[] | null>(null);

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			filter: "",
		},
	});
	const filter = form.watch().filter.toLowerCase();

	useEffect(() => {
		authenticatedFetchAsync(getAlbinaApiFullAddress("/users"), {
			cache: "no-cache",
		}).then((response) => {
			response
				.json()
				.then((data: { users: FullUser[] | null }) =>
					setUsers(
						data.users
							? data.users.sort((a, b) => a.nickname.localeCompare(b.nickname))
							: [],
					),
				);
		});
	}, [setUsers]);
	if (users === null) return null;
	if (users.length === 0) {
		return (
			<>
				<UIBasics.Header
					textAlign="center"
					textColor="gray"
					children="Não há usuários disponíveis para lhe serem exibidos"
				/>
			</>
		);
	}

	const filteredUsers: FullUser[] =
		filter.length === 0
			? users
			: users.filter(
					(user) =>
						user.username.toLowerCase().includes(filter) ||
						user.nickname.toLowerCase().includes(filter) ||
						user.role.toLowerCase().includes(filter),
				);

	return (
		<UIBasics.Box
			withoutPadding
			backgroundColor="darkGray">
			<HookedForm.Form form={form}>
				<HookedForm.TextInput<FormData>
					fieldName="filter"
					label="Filtro"
				/>
				{filteredUsers.length === 0 && (
					<UIBasics.Header
						textAlign="center"
						textColor="gray"
						children="Nenhum Resultado"
					/>
				)}
			</HookedForm.Form>

			{filteredUsers.length !== 0 && (
				<>
					<UIBasics.Header
						textAlign="center"
						textColor="red"
						children={"Admins"}
					/>
					<UIBasics.Box backgroundColor="red">
						<UIBasics.Carousel
							slidesOrigin={"center"}
							slidesSpacing={10}
							minWidth={150}
							memoryId={"Favorites"}
							slideChilds={users
								.filter(
									(user) =>
										RoleHierarchy[user.role] >= RoleHierarchy.Admin &&
										RoleHierarchy[user.role] != RoleHierarchy.Bot,
								)
								.map((user) => (
									<StyledLinkCard
										key={user.id}
										size={150}
										href={`/users/${user.username}`}
										title={user.nickname}
										artworkUrl={getAlbinaApiFullAddress(
											`/users/${user.username}/favicon`,
										)}
										layout="rectangle"
										borderColor="red"
										titleColor="red"
									/>
								))}
						/>
					</UIBasics.Box>
					<UIBasics.Header
						textAlign="center"
						textColor="darkGray"
						backgroundColor="darkGray"
						children={"Usuários"}
					/>
					<UIBasics.List.Grid
						direction="row"
						backgroundColor="blue"
						columnWidth={150}>
						{users
							.filter((user) => RoleHierarchy[user.role] < RoleHierarchy.Admin)
							.map((user) => (
								<StyledLinkCard
									key={user.id}
									size={150}
									href={`/users/${user.username}`}
									title={user.nickname}
									artworkUrl={getAlbinaApiFullAddress(
										`/users/${user.username}/favicon`,
									)}
									layout="rectangle"
									borderColor={
										RoleHierarchy[user.role] == RoleHierarchy.User
											? "blue"
											: "gray"
									}
									titleColor={
										RoleHierarchy[user.role] == RoleHierarchy.User
											? "blue"
											: "gray"
									}
									backgroundColor={
										RoleHierarchy[user.role] == RoleHierarchy.User
											? "blue"
											: "gray"
									}
								/>
							))}
					</UIBasics.List.Grid>
					<UIBasics.Header
						textAlign="center"
						textColor="darkGray"
						children={"Bots"}
					/>
					<UIBasics.Box backgroundColor="darkGray">
						<UIBasics.Carousel
							slidesOrigin={"center"}
							slidesSpacing={10}
							minWidth={150}
							memoryId={"Bots"}
							slideChilds={users
								.filter((user) => RoleHierarchy[user.role] == RoleHierarchy.Bot)
								.map((user) => (
									<StyledLinkCard
										key={user.id}
										size={150}
										href={`/users/${user.username}`}
										title={user.nickname}
										artworkUrl={getAlbinaApiFullAddress(
											`/users/${user.username}/favicon`,
										)}
										layout="rectangle"
										titleColor="yellow"
										backgroundColor="yellow"
										borderColor="yellow"
									/>
								))}
						/>
					</UIBasics.Box>
				</>
			)}
		</UIBasics.Box>
	);
}

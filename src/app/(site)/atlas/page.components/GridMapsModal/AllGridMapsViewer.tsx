"use client";

import styles from "./AllGridMapsViewer.module.css";
import { LoadingCircle } from "@/components/(Design)/components/LoadingCircle";
import { HookedForm } from "@/libs/stp@forms";
import { useCurrentUser } from "@/libs/stp@hooks";
import { Guid } from "@/libs/stp@types";
import { GridMap } from "@/libs/stp@types/dataTypes/gridMap";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { newStyledElement } from "@setsu-tp/styled-components";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GridMapsCreator } from "./GridMapsCreator";
import { UIBasics } from "@/components/(UIBasics)";
import { GridMapInteractionModal } from "./GridMapInteractionModal";

const AllGridMapsViewerContainer = newStyledElement.div(
	styles.allGridMapsViewerContainer,
);
const HeaderContainer = newStyledElement.div(styles.headerContainer);

type FormData = {
	query: string;
};

interface AllGridMapsViewerProps {
	isInVtt: boolean;
	setEditingGridMapId: Dispatch<SetStateAction<Guid | null>>;
}
export function AllGridMapsViewer({
	isInVtt,
	setEditingGridMapId,
}: AllGridMapsViewerProps) {
	const { user } = useCurrentUser();
	const [allGridMaps, setAllGridMaps] = useState<GridMap[]>([]);
	const [query, setQuery] = useState<string>("");

	const form = useForm<FormData>({
		defaultValues: {
			query: "",
		},
	});

	useEffect(() => {
		(async () => {
			const response = await fetch(
				query.length >= 2
					? getAlbinaApiFullAddress(`/search/gridmaps?query=${query}`)
					: getAlbinaApiFullAddress(`/gridmaps`),
			);
			if (!response.ok) return;
			setAllGridMaps(await response.json());
		})();
	}, [query]);

	if (!user) return <LoadingCircle centralizeVertical={23} />;
	return (
		<AllGridMapsViewerContainer>
			<HeaderContainer>
				<HookedForm.Form<FormData>
					form={form}
					onChangeAction={(data) => {
						const query = data.query
							.trim()
							.replace(/\s*,\s*/g, ",")
							.replace(/,{2,}/g, ",")
							.replace(/^,|,$/g, "");
						setQuery(query);
					}}>
					<HookedForm.TextInput<FormData>
						fieldName={"query"}
						placeholder={"Pesquisar"}
						label={"Filtro"}
					/>
				</HookedForm.Form>
				{isInVtt && (
					<GridMapsCreator setEditingGridMapId={setEditingGridMapId} />
				)}
			</HeaderContainer>
			<HookedForm.Space />
			<UIBasics.List.Grid
				withoutBorder={true}
				columnWidth={250}>
				{allGridMaps.map((map) => (
					<GridMapInteractionModal
						key={map.id}
						gridMap={map}
						setEditingGridMapId={setEditingGridMapId}
						isInVtt={isInVtt}
					/>
				))}
			</UIBasics.List.Grid>
		</AllGridMapsViewerContainer>
	);
}

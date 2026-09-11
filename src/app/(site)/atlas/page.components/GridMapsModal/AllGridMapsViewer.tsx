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

const AllGridMapsViewerContainer = newStyledElement.div(
	styles.allGridMapsViewerContainer,
);

type FormData = {
	query: string;
};

interface AllGridMapsViewerProps {
	setEditingGridMapId: Dispatch<SetStateAction<Guid | null>>;
}
export function AllGridMapsViewer({
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
					: getAlbinaApiFullAddress(`/search/gridmaps`),
			);
			if (!response.ok) return;
			setAllGridMaps(await response.json());
		})();
	}, [query]);

	void setEditingGridMapId;

	if (!user) return <LoadingCircle centralizeVertical={23} />;
	return (
		<AllGridMapsViewerContainer>
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
			<HookedForm.Space />
			{allGridMaps.map((map) => (
				<div key={map.id}>{map.id}</div>
			))}
		</AllGridMapsViewerContainer>
	);
}

"use client";

import { UIBasics } from "@/components/(UIBasics)";
import { HookedForm } from "@/libs/stp@forms";
import {
	CreatureData,
	CreatureSubTypeName,
	CreatureTypeName,
} from "@/libs/stp@types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BestiaryLevelGridView } from "./BestiaryLevelGridView";

type FormData = {
	query: string;
};

interface BestiarySearchWithLevelProps {
	creatures: CreatureData[];
}
export function BestiarySearchWithLevel({
	creatures,
}: BestiarySearchWithLevelProps) {
	const [filtered, setFiltered] = useState<CreatureData[][]>(
		groupCreaturesByLevel(creatures),
	);
	const form = useForm<FormData>({
		defaultValues: { query: "" },
	});

	function updateFiltered(formData: FormData) {
		if (formData.query.length < 2) {
			setFiltered(groupCreaturesByLevel(creatures));
			return;
		}
		const search = formData.query.trim().toLocaleLowerCase();
		setFiltered(
			groupCreaturesByLevel(
				creatures.filter((creature) => {
					return [
						creature.name,
						creature.slug,
						creature.type,
						creature.subType,
						CreatureTypeName[creature.type],
						CreatureSubTypeName[creature.subType],
						creature.lifeState,
						creature.alignment?.ethic,
						creature.alignment?.moral,
					]
						.filter(Boolean)
						.some((value) =>
							String(value).toLocaleLowerCase().includes(search),
						);
				}),
			),
		);
	}
	return (
		<HookedForm.Form<FormData>
			form={form}
			actionDebounceMs={100}
			onChangeAction={updateFiltered}>
			<UIBasics.Box backgroundColor="darkGray">
				<HookedForm.TextInput<FormData>
					fieldName="query"
					label="Buscar"
				/>
				{filtered.length > 0 &&
					filtered.map((creaturesFromThisLevelFiltered, index) => (
						<BestiaryLevelGridView
							key={index}
							creatures={creaturesFromThisLevelFiltered}
						/>
					))}
			</UIBasics.Box>
		</HookedForm.Form>
	);
}

function groupCreaturesByLevel(creatures: CreatureData[]): CreatureData[][] {
	const groups: CreatureData[][] = [];

	for (const creature of creatures) {
		const level = creature.level;

		if (!groups[level]) {
			groups[level] = [];
		}

		groups[level].push(creature);
	}

	return groups;
}

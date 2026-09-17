"use client";

import styles from "./index.module.css";
import { UIBasics } from "@/components/(UIBasics)";
import { useCurrentUser } from "@/libs/stp@hooks";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IAvailableDie, ITheme } from "dddice-js";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { UserDiceSet, UserDiceSetType } from "@/libs/stp@types";
import { HookedForm } from "@/libs/stp@forms";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { newStyledElement } from "@setsu-tp/styled-components";
import Image from "next/image";
import { BaseSelectOption } from "@/libs/stp@forms/components/base/BaseSelect";
import { LoadingCircle } from "@/components/(Design)/components/LoadingCircle";
import toast from "react-hot-toast";

export function DDDice() {
	const { externalConnections } = useCurrentUser();
	if (!externalConnections || !externalConnections.dddice) return null;

	return (
		<UIBasics.Box backgroundColor={"gray"}>
			<UIBasics.Header
				textColor={"gray"}
				textAlign={"center"}>
				DDDice Dice Sets
			</UIBasics.Header>
			<UIBasics.Box
				backgroundColor={"darkGray"}
				withoutMargin>
				<DDDiceContainer dddiceId={externalConnections.dddice.externalUserId} />
			</UIBasics.Box>
		</UIBasics.Box>
	);
}

interface DDDiceThemes {
	[key: number]: DDDiceTheme[];
}
interface DDDiceTheme {
	name: string;
	notation?: string;
	themeId: string;
	preview: string;
}

function getDiceNumber(dice: string): number {
	return Number(dice.slice(1));
}

interface DDDiceContainerProps {
	dddiceId: string;
}
function DDDiceContainer({ dddiceId }: DDDiceContainerProps) {
	const [themes, setThemes] = useState<DDDiceThemes | null>(null);
	const [currentDiceSets, setCurrentDiceSets] = useState<UserDiceSet[] | null>(
		null,
	);

	useEffect(() => {
		(async () => {
			const response = await authenticatedFetchAsync(`/users/me/dice-sets`);
			if (!response.ok) return;
			setCurrentDiceSets(await response.json());
		})();
	}, [dddiceId]);
	useEffect(() => {
		(async () => {
			const response = await fetch(
				`https://dddice.com/api/1.0/dice-box?limit=47063.46`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${dddiceId}`,
						Accept: "application/json",
					},
				},
			);
			if (!response.ok) return;
			const data: ITheme[] = (await response.json()).data;
			const dddiceThemes: DDDiceThemes = {};
			for (const theme of data) {
				for (const die of theme.available_dice as IAvailableDie[]) {
					try {
						const diceNumber = getDiceNumber(die.type);
						if (!dddiceThemes[diceNumber]) dddiceThemes[diceNumber] = [];
						dddiceThemes[diceNumber].push({
							notation: die.notation,
							name: `${theme.name ?? theme.id}${die.notation ? (die.notation != die.type ? " Alter" : "") : ""}`,
							preview: theme.preview[die.id],
							themeId: theme.id,
						});
					} catch (ex) {
						void ex;
					}
				}
			}
			setThemes(dddiceThemes);
		})();
	}, [dddiceId]);

	if (themes == null || currentDiceSets == null)
		return <LoadingCircle centralizeVertical={0} />;
	return (
		<DDDiceForm
			currentDiceSets={currentDiceSets}
			dddiceThemes={themes}
			setCurrentDiceSets={setCurrentDiceSets}
		/>
	);
}

// Form ////////////////////////////////////////////////////////////////////////

const ColumnContainer = newStyledElement.div(styles.columnContainer);
const DiceSetSelectorContainer = newStyledElement.div(
	styles.diceSetSelectorContainer,
);
const DiceSetSelectorPreviewContainer = newStyledElement.div(
	styles.diceSetSelectorPreviewContainer,
);

const supportedDiceValues = [2, 4, 6, 8, 10, 12, 16, 20] as const;
const userDiceSetSchema = z.object({
	name: z.string(),
	notation: z.string().optional(),
	themeId: z.string(),
	preview: z.string(),
});
const schema = z.object(
	Object.fromEntries(
		supportedDiceValues.flatMap((dice) => [
			[`dice${dice}Primary`, userDiceSetSchema.nullable()],
			[`dice${dice}Secondary`, userDiceSetSchema.nullable()],
		]),
	),
);
type FormData = z.infer<typeof schema>;

interface DDDiceFormProps {
	dddiceThemes: DDDiceThemes;
	currentDiceSets: UserDiceSet[];
	setCurrentDiceSets: Dispatch<SetStateAction<UserDiceSet[] | null>>;
}
function DDDiceForm({
	dddiceThemes,
	currentDiceSets,
	setCurrentDiceSets,
}: DDDiceFormProps) {
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: "all",
		defaultValues: Object.fromEntries([
			...supportedDiceValues.flatMap((dice) => [
				[`dice${dice}Primary`, null],
				[`dice${dice}Secondary`, null],
			]),
			...currentDiceSets.flatMap((diceSet) => {
				const theme = dddiceThemes[diceSet.dice]?.find(
					(theme) => theme.themeId === diceSet.ddDiceTheme,
				);
				if (!theme) return [];
				return [[`dice${diceSet.dice}${diceSet.type}`, theme]];
			}),
		]),
	});
	const watchedValues = form.watch();

	async function handleSubmit(data: FormData) {
		const toastId = toast.loading("Salvando...");
		const updatedDiceSets = [...currentDiceSets];

		try {
			for (const [key, value] of Object.entries(data)) {
				const [, dieString, type] = key.match(
					/^dice(\d+)(Primary|Secondary)$/,
				)!;
				const die = Number(dieString);

				const index = updatedDiceSets.findIndex(
					(set) => set.dice === die && set.type === type,
				);
				if (value == null) {
					if (index == -1) continue;
					const response = await authenticatedFetchAsync(
						`/users/me/dice-sets/${die}/${type}`,
						{
							method: "DELETE",
						},
					);
					if (!response.ok) throw `Error Delete ${die} ${type}`;
					updatedDiceSets.splice(index, 1);
					continue;
				}
				if (
					index != -1 &&
					value.themeId === updatedDiceSets[index].ddDiceTheme &&
					value.name === updatedDiceSets[index].diceName &&
					value.preview === updatedDiceSets[index].preview
				)
					continue;

				const response = await authenticatedFetchAsync(
					`/users/me/dice-sets/${die}/${type}`,
					{
						method: "PUT",
						body: JSON.stringify({
							diceName: value.name,
							dDDiceTheme: value.themeId,
							preview: value.preview,
						}),
						headers: {
							"Content-Type": "application/json",
						},
					},
				);
				if (!response.ok) throw `Error Put ${die} ${type}`;
				const newDiceSet = await response.json();
				if (index === -1) updatedDiceSets.push(newDiceSet);
				else updatedDiceSets[index] = newDiceSet;
				continue;
			}
		} catch {
			toast.error("Erro ao salvar", { id: toastId });
			return;
		}
		setCurrentDiceSets(updatedDiceSets);
		toast.success("Salvo", { id: toastId });
		return true;
	}

	return (
		<HookedForm.Form
			form={form}
			className={styles.form}
			onSubmit={handleSubmit}>
			<UIBasics.MultiColumn.Two
				colum1={
					<DiceSetSelectorColumn
						themes={dddiceThemes}
						type={"Primary"}
						watchedValues={watchedValues}
					/>
				}
				colum2={
					<DiceSetSelectorColumn
						themes={dddiceThemes}
						type={"Secondary"}
						watchedValues={watchedValues}
					/>
				}
			/>
			<HookedForm.SubmitButton label={"Salvar"} />
		</HookedForm.Form>
	);
}

interface DiceSetSelectorColumnProps {
	themes: DDDiceThemes;
	type: keyof typeof UserDiceSetType;
	watchedValues: {
		[x: string]: DDDiceTheme | null;
	};
}
function DiceSetSelectorColumn({
	themes,
	type,
	watchedValues,
}: DiceSetSelectorColumnProps) {
	return (
		<ColumnContainer>
			{supportedDiceValues.map((die) => (
				<DiceSetSelector
					key={die}
					die={die}
					themes={themes[die]}
					type={type}
					watchedValues={watchedValues}
				/>
			))}
		</ColumnContainer>
	);
}

interface DiceSetSelectorProps {
	type: keyof typeof UserDiceSetType;
	die: (typeof supportedDiceValues)[number];
	themes: DDDiceTheme[];
	watchedValues: {
		[x: string]: DDDiceTheme | null;
	};
}
function DiceSetSelector({
	die,
	type,
	themes,
	watchedValues,
}: DiceSetSelectorProps) {
	if (themes == undefined) return null;
	const fieldName = `dice${die}${type}`;
	const currentValue = watchedValues[fieldName];

	return (
		<DiceSetSelectorContainer>
			<HookedForm.AsyncSearchSelect<FormData>
				fieldName={fieldName}
				label={`D${die} ${type == "Primary" ? "Primário" : "Secundário"}`}
				queryMinLength={1}
				optionGenerator={(query) => {
					const options: BaseSelectOption[] = themes
						.filter((theme) =>
							theme.name
								.toLocaleLowerCase()
								.includes(query.toLocaleLowerCase()),
						)
						.map((theme) => ({
							name: theme.name,
							value: theme,
							icon: theme.preview,
						}));

					return options;
				}}
				defaultOptions={themes.map((theme) => ({
					name: theme.name,
					value: theme,
					icon: theme.preview,
				}))}
			/>
			{currentValue && (
				<DiceSetSelectorPreviewContainer>
					<Image
						src={currentValue.preview}
						alt={`${currentValue.name}'s Preview`}
						width={60}
						height={60}
					/>
				</DiceSetSelectorPreviewContainer>
			)}
		</DiceSetSelectorContainer>
	);
}

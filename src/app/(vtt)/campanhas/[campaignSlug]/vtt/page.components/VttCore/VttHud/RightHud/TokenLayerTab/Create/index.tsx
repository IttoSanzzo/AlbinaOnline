import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./index.module.css";
import z from "zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HookedForm } from "@/libs/stp@forms";
import { VttTokenCreationOption } from "../../../../../Types/Classes/VttToken";
import { setVttElementHoverInteraction } from "../../../../../Utils/ElementDataAttributeUtils";
import { VttTokenCreationTabEntryImageRenderer } from "../../../../VttBoard/TokenBoardLayer/VttTokenImageRenderer";

const TokenCreatorTabContentContainer = newStyledElement.div(
	styles.tokenCreatorTabContent,
);
const TokenOptionsContainer = newStyledElement.div(
	styles.tokenOptionsContainer,
);
const EntryTypeContainer = newStyledElement.p(styles.entryTypeContainer);
const EntryTypeTitle = newStyledElement.p(styles.entryTypeTitle);

const schema = z.object({
	query: z.string(),
});
type FormData = z.infer<typeof schema>;

async function fetchOptionsAsync(
	query: string | null,
	setTokenOptions: Dispatch<SetStateAction<VttTokenCreationOption[]>>,
) {
	try {
		const finalQuery = query?.trim().toLowerCase() ?? "";
		const response = await authenticatedFetchAsync(
			`/tokens/store${finalQuery.length > 0 ? `?query=${query}` : ""}`,
		);
		if (!response.ok) return;
		setTokenOptions(await response.json());
	} catch (ex) {
		void ex;
	}
}

export function TokenCreatorTabContent() {
	const [tokenOptions, setTokenOptions] = useState<VttTokenCreationOption[]>(
		[],
	);

	useEffect(() => {
		fetchOptionsAsync(null, setTokenOptions);
	}, [setTokenOptions]);

	async function handleAction({ query }: FormData) {
		fetchOptionsAsync(query, setTokenOptions);
	}

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: "all",
		defaultValues: {
			query: "",
		},
	});

	const characterOptions: VttTokenCreationOption[] = [];
	const creatureOptions: VttTokenCreationOption[] = [];
	const itemOptions: VttTokenCreationOption[] = [];

	tokenOptions.forEach((option) => {
		switch (option.type) {
			case "Character":
				characterOptions.push(option);
				return;
			case "Creature":
				creatureOptions.push(option);
				return;
			case "Item":
				itemOptions.push(option);
				return;
		}
	});

	return (
		<TokenCreatorTabContentContainer>
			<HookedForm.Form
				form={form}
				actionDebounceMs={300}
				onChangeAction={handleAction}>
				<HookedForm.TextInput<FormData>
					fieldName={"query"}
					label={""}
					placeholder={"Pesquisar"}
					style={{
						textAlign: "center",
						paddingTop: "10px",
						paddingBottom: "10px",
						color: "var(--cl-gray-300)",
						backgroundColor: "rgb(from var(--cl-black-3) r g b / 25%)",
					}}
				/>
			</HookedForm.Form>
			<TokenOptionsContainer>
				{characterOptions.length > 0 && (
					<EntryTypeContainer>
						<EntryTypeTitle style={{ color: "var(--cl-blue-300)" }}>
							Personagens
						</EntryTypeTitle>
						{characterOptions.map((option) => (
							<TokenCreationEntry
								key={`${option.type}|${option.targetId}`}
								vttTokenCreationOption={option}
							/>
						))}
					</EntryTypeContainer>
				)}
				{creatureOptions.length > 0 && (
					<EntryTypeContainer>
						<EntryTypeTitle style={{ color: "var(--cl-red-300)" }}>
							Criaturas
						</EntryTypeTitle>
						{creatureOptions.map((option) => (
							<TokenCreationEntry
								key={`${option.type}|${option.targetId}`}
								vttTokenCreationOption={option}
							/>
						))}
					</EntryTypeContainer>
				)}
				{itemOptions.length > 0 && (
					<EntryTypeContainer>
						<EntryTypeTitle style={{ color: "var(--cl-green-300)" }}>
							Items
						</EntryTypeTitle>
						{itemOptions.map((option) => (
							<TokenCreationEntry
								key={`${option.type}|${option.targetId}`}
								vttTokenCreationOption={option}
							/>
						))}
					</EntryTypeContainer>
				)}
			</TokenOptionsContainer>
		</TokenCreatorTabContentContainer>
	);
}

const EntrySeparator = newStyledElement.div(styles.entrySeparator);
const TokenCreationEntryContainer = newStyledElement.div(
	styles.tokenCreationEntryContainer,
);
const TokenCreationEntryImageContainer = newStyledElement.div(
	styles.tokenCreationEntryImageContainer,
);
const TokenCreationEntryName = newStyledElement.div(
	styles.tokenCreationEntryName,
);

interface TokenCreationEntryProps {
	vttTokenCreationOption: VttTokenCreationOption;
}
function TokenCreationEntry({
	vttTokenCreationOption,
}: TokenCreationEntryProps) {
	return (
		<div>
			<EntrySeparator />
			<TokenCreationEntryContainer
				{...setVttElementHoverInteraction("Pointer")}
				onClick={() => {
					console.log(vttTokenCreationOption);
				}}>
				<TokenCreationEntryImageContainer>
					<VttTokenCreationTabEntryImageRenderer
						type={vttTokenCreationOption.type}
						targetId={vttTokenCreationOption.targetId}
					/>
				</TokenCreationEntryImageContainer>
				<TokenCreationEntryName>
					{vttTokenCreationOption.name}
				</TokenCreationEntryName>
			</TokenCreationEntryContainer>
		</div>
	);
}

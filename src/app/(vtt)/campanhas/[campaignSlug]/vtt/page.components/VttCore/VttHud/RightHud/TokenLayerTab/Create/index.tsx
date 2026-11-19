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
import { useVttContext } from "../../../../../Contexts/VttContextProvider";
import { Guid } from "@/libs/stp@types";
import { VttTokenPlacementPreviewWrapper } from "../Components/VttTokenPlacementPreview";

const TokenCreatorTabContentContainer = newStyledElement.div(
	styles.tokenCreatorTabContent,
);
const TokenOptionsContainer = newStyledElement.div(
	styles.tokenOptionsContainer,
);
const EntryTypeSeparator = newStyledElement.span(styles.entrySeparator);
const TokenOptionsList = newStyledElement.div(styles.tokenOptionsList);
const EntryTypeContainer = newStyledElement.div(styles.entryTypeContainer);
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
						backgroundColor: "rgb(from var(--cl-black-3) r g b / 50%)",
					}}
					styleContainer={{
						border: "none",
					}}
				/>
			</HookedForm.Form>
			<TokenOptionsContainer>
				{characterOptions.length > 0 && (
					<EntryTypeContainer className={styles.characterType}>
						<EntryTypeTitle style={{ color: "var(--cl-blue-300)" }}>
							Personagens
						</EntryTypeTitle>
						<TokenOptionsList>
							{characterOptions.map((option) => (
								<TokenCreationEntry
									key={`${option.type}|${option.targetId}`}
									vttTokenCreationOption={option}
								/>
							))}
						</TokenOptionsList>
					</EntryTypeContainer>
				)}
				{characterOptions.length > 0 && creatureOptions.length > 0 && (
					<EntryTypeSeparator />
				)}
				{creatureOptions.length > 0 && (
					<EntryTypeContainer className={styles.creatureType}>
						<EntryTypeTitle style={{ color: "var(--cl-red-300)" }}>
							Criaturas
						</EntryTypeTitle>
						<TokenOptionsList>
							{creatureOptions.map((option) => (
								<TokenCreationEntry
									key={`${option.type}|${option.targetId}`}
									vttTokenCreationOption={option}
								/>
							))}
						</TokenOptionsList>
					</EntryTypeContainer>
				)}
				{creatureOptions.length > 0 && itemOptions.length > 0 && (
					<EntryTypeSeparator />
				)}
				{itemOptions.length > 0 && (
					<EntryTypeContainer className={styles.itemType}>
						<EntryTypeTitle style={{ color: "var(--cl-green-300)" }}>
							Items
						</EntryTypeTitle>
						<TokenOptionsList>
							{itemOptions.map((option) => (
								<TokenCreationEntry
									key={`${option.type}|${option.targetId}`}
									vttTokenCreationOption={option}
								/>
							))}
						</TokenOptionsList>
					</EntryTypeContainer>
				)}
				<div style={{ marginTop: "var(--sp-2)" }}>
					<TokenCreationEntry
						key={`None|${Guid.Empty}`}
						vttTokenCreationOption={{
							level: 0,
							name: "Genérico",
							type: "None",
						}}
						className={styles.genericEntry}
					/>
				</div>
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
const TokenCreationEntryName = newStyledElement.p(
	styles.tokenCreationEntryName,
);

interface TokenCreationEntryProps {
	vttTokenCreationOption: VttTokenCreationOption;
	className?: string;
}
function TokenCreationEntry({
	vttTokenCreationOption,
	className,
}: TokenCreationEntryProps) {
	const [isPlacementActive, setPlacementActive] = useState(false);
	const send = useVttContext((state) => state.send);
	const sceneId = useVttContext((state) => state.activeSceneId);

	return (
		<div>
			<EntrySeparator />
			<TokenCreationEntryContainer
				className={className}
				{...setVttElementHoverInteraction("Pointer")}
				onPointerDown={(event) => {
					if (event.button == 0) setPlacementActive(true);
				}}
				onContextMenu={(event) => {
					event.preventDefault();
					const targetUrl = (() => {
						switch (vttTokenCreationOption.type) {
							case "Character":
								return `/chars/${vttTokenCreationOption.targetId}`;
							case "Creature":
								return `/bestiario/from-id/${vttTokenCreationOption.targetId}`;
							case "Item":
								return `/items/from-id/${vttTokenCreationOption.targetId}`;
							default:
								return undefined;
						}
					})();
					if (targetUrl)
						window.open(
							targetUrl,
							"popupWindow",
							"width=920,height=920,noopener,noreferrer",
						);
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
			{isPlacementActive && (
				<VttTokenPlacementPreviewWrapper
					targetId={vttTokenCreationOption.targetId}
					targetType={vttTokenCreationOption.type}
					onPlace={(coordinates) => {
						setPlacementActive(false);
						send({
							id: Guid.NewGuid(),
							method: "Post",
							path: "/tokens",
							data: {
								type: vttTokenCreationOption.type,
								targetId: vttTokenCreationOption.targetId,
								ephemeral: false,
								position: {
									sceneId: sceneId,
									x: coordinates.x,
									y: coordinates.y,
								},
							},
						});
					}}
					onCancel={() => setPlacementActive(false)}
					validatePlacement={(_, pointerPosition) => {
						const element = document.getElementById("VttHud-RightHud");
						if (!element) return true;

						const rect = element.getBoundingClientRect();

						return !(
							pointerPosition.x >= rect.left &&
							pointerPosition.x <= rect.right &&
							pointerPosition.y >= rect.top &&
							pointerPosition.y <= rect.bottom
						);
					}}
				/>
			)}
		</div>
	);
}

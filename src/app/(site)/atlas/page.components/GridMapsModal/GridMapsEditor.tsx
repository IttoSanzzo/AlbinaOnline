"use client";

import styles from "./GridMapsEditor.module.css";
import { Guid, SearchEntry } from "@/libs/stp@types";
import { newStyledElement } from "@setsu-tp/styled-components";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DEFAULT_MOCK_GRID_COLORS, GridMapGridViewer } from "./MockGrid";
import { GridMap } from "@/libs/stp@types/dataTypes/gridMap";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { LoadingCircle } from "@/components/(Design)/components/LoadingCircle";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { HookedForm, toSlug } from "@/libs/stp@forms";
import { UIBasics } from "@/components/(UIBasics)";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import clsx from "clsx";
import toast from "react-hot-toast";
import { AlertDialog } from "@/libs/stp@radix";
import { StateSwitch } from "@/components/(UTILS)";
import { useLocalStorageState } from "@/utils/Storage";
import { revalidateTagByClientSide } from "@/utils/ServerActions";

const GridMapsEditorContainer = newStyledElement.div(
	styles.gridMapsEditorContainer,
);

interface GridMapsEditorProps {
	gridMapId: Guid;
	setEditingGridMapId: Dispatch<SetStateAction<Guid | null>>;
}
export function GridMapsEditor({
	gridMapId,
	setEditingGridMapId,
}: GridMapsEditorProps) {
	const gridMapState = useState<GridMap | null>(null);

	useEffect(() => {
		(async () => {
			const response = await fetch(
				getAlbinaApiFullAddress(`/gridmaps/${gridMapId}`),
			);
			if (!response.ok) {
				gridMapState[1](null);
				setEditingGridMapId(null);
				return;
			}
			gridMapState[1](await response.json());
		})();
	}, [gridMapId, gridMapState[1]]);
	if (gridMapState[0] == null) return <LoadingCircle centralizeVertical={10} />;

	return (
		<EditorCore
			key={gridMapId}
			gridMapState={
				gridMapState as [GridMap, Dispatch<SetStateAction<GridMap | null>>]
			}
			setEditingGridMapId={setEditingGridMapId}
		/>
	);
}

// Form ////////////////////////////////////////////////////////////////////////

const EditorCoreRightContainer = newStyledElement.div(
	styles.editorCoreRightContainer,
);
const DeleteButton = newStyledElement.button(styles.deleteButton);
const GridControlsContainer = newStyledElement.div(
	styles.gridControlsContainer,
);

const schema = z.object({
	name: z.string().min(3, "Min Length 3").max(30, "Max Length 30"),
	width: z.number().min(100, "Min 100").max(20000, "Max 20000"),
	height: z.number().min(100, "Min 100").max(20000, "Max 20000"),
	offsetX: z.number().min(0, "Min 0").max(99, "Max 99"),
	offsetY: z.number().min(0, "Min 0").max(99, "Max 99"),
	tags: z.string(),
	locationId: z.string().nullable(),
});

type FormData = z.infer<typeof schema>;

interface EditorCoreProps {
	gridMapState: [GridMap, Dispatch<SetStateAction<GridMap | null>>];
	setEditingGridMapId: Dispatch<SetStateAction<Guid | null>>;
}
function EditorCore({
	gridMapState: [gridMap, setGridMap],
	setEditingGridMapId,
}: EditorCoreProps) {
	const [deletionOpenState, setDeletionOpenState] = useState<boolean>(false);
	const showGridState = useState<boolean>(true);
	const [sizesAreExact, setSizesAreExact] = useState({
		x: 0,
		y: 0,
	});
	const [gridColors, setGridColors] = useLocalStorageState(
		"grid-map-viewer-colors",
		DEFAULT_MOCK_GRID_COLORS,
	);

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: "all",
		defaultValues: {
			name: gridMap.name,
			height: gridMap.height,
			width: gridMap.width,
			locationId:
				gridMap.locationId != "00000000-0000-0000-0000-000000000000"
					? (gridMap.locationId as string)
					: undefined,
			offsetX: gridMap.offsetX,
			offsetY: gridMap.offsetY,
			tags: gridMap.tags.join(", "),
		},
	});

	const getNewGridMap = (data: FormData): GridMap => ({
		...gridMap,
		name: data.name,
		height: data.height,
		width: data.width,
		locationId: data.locationId != null ? (data.locationId as Guid) : undefined,
		offsetX: data.offsetX,
		offsetY: data.offsetY,
		tags:
			data.tags.trim() != ""
				? data.tags.split(",").map((tag) => toSlug(tag.trim()))
				: [],
	});

	async function handleSubmit(data: FormData) {
		const toastId = toast.loading("Salvando...");
		const response = await authenticatedFetchAsync(`/gridmaps/${gridMap.id}`, {
			method: "Put",
			body: JSON.stringify(getNewGridMap(data)),
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			toast.error("Erro ao salvar!", {
				id: toastId,
			});
			return;
		}
		toast.success("Salvo!", {
			id: toastId,
		});
		setGridMap(await response.json());
		await revalidateTagByClientSide("/gridmaps");
		return true;
	}
	async function handleDeletion() {
		const toastId = toast.loading("Deletando...");
		const response = await authenticatedFetchAsync(`/gridmaps/${gridMap.id}`, {
			method: "Delete",
		});
		if (!response.ok) {
			toast.error("Erro ao deletar!", {
				id: toastId,
			});
			return;
		}
		toast.success("Deletado!", {
			id: toastId,
		});
		await revalidateTagByClientSide("/gridmaps");
		setEditingGridMapId(null);
	}
	function debouncedAction(data: FormData) {
		setGridMap(getNewGridMap(data));
	}

	return (
		<GridMapsEditorContainer>
			<GridMapGridViewer
				gridMap={{
					...gridMap,
				}}
				showGrid={showGridState[0]}
				setSizesAreExact={setSizesAreExact}
				primaryColor={gridColors.primary}
				secondaryColor={gridColors.secondary}
			/>
			<EditorCoreRightContainer>
				<HookedForm.Form
					form={form}
					onSubmit={handleSubmit}
					actionDebounceMs={500}
					onChangeAction={debouncedAction}>
					<HookedForm.TextInput<FormData>
						fieldName={"name"}
						label={"Nome"}
						min={3}
						max={30}
					/>
					<UIBasics.MultiColumn.Two
						colum1={
							<div className={styles.sideArm}>
								<HookedForm.NumberInput<FormData>
									fieldName={"width"}
									label={"Largura (cm)"}
									min={100}
									max={20000}
									step={50}
									color={
										sizesAreExact.x == 0
											? "gray"
											: sizesAreExact.x < 0
												? "red"
												: "blue"
									}
								/>
								<HookedForm.NumberInput<FormData>
									fieldName={"offsetX"}
									label={"Offset X (cm)"}
									min={0}
									max={99}
									step={1}
								/>
							</div>
						}
						colum2={
							<div className={styles.sideArm}>
								<HookedForm.NumberInput<FormData>
									fieldName={"height"}
									label={"Altura (cm)"}
									min={100}
									max={20000}
									step={50}
									color={
										sizesAreExact.y == 0
											? "gray"
											: sizesAreExact.y < 0
												? "red"
												: "blue"
									}
								/>
								<HookedForm.NumberInput<FormData>
									fieldName={"offsetY"}
									label={"Offset Y (cm)"}
									min={0}
									max={99}
									step={1}
								/>
							</div>
						}
					/>
					<HookedForm.AsyncSearchSelect<FormData>
						fieldName="locationId"
						label={"Localização"}
						placeholder={"Location Name"}
						optionGenerator={async (query) => {
							const response = await authenticatedFetchAsync(
								getAlbinaApiFullAddress(`/search/atlas?query=${query}`),
							);
							if (!response.ok) return [];
							const locationMetas: SearchEntry[] = await response.json();
							return locationMetas.map((meta) => ({
								name: meta.title,
								value: meta.id,
								icon: meta.iconUrl,
							}));
						}}
					/>
					<HookedForm.TextAreaInput<FormData>
						fieldName={"tags"}
						style={{ resize: "none" }}
					/>

					<UIBasics.MultiColumn.Two
						colum1={
							<div
								className={clsx(styles.sideArm, styles.cancelButton)}
								onClick={() => {
									form.reset();
									setEditingGridMapId(null);
								}}>
								Voltar
							</div>
						}
						colum2={
							<div className={styles.sideArm}>
								<HookedForm.SubmitButton label={"Salvar"} />
							</div>
						}
					/>
				</HookedForm.Form>
				<HookedForm.Space height={3} />
				<AlertDialog.Root
					open={deletionOpenState}
					onOpenChange={setDeletionOpenState}>
					<AlertDialog.Trigger asChild>
						<DeleteButton>Deletar</DeleteButton>
					</AlertDialog.Trigger>
					<AlertDialog.Portal>
						<AlertDialog.Overlay onClick={() => setDeletionOpenState(false)} />
						<AlertDialog.Content>
							<AlertDialog.Title>Deletar?</AlertDialog.Title>
							<AlertDialog.Description>
								O procedimento permanente.
							</AlertDialog.Description>
							<AlertDialog.ButtonsContainer alignment={"space-around"}>
								<AlertDialog.Action color={"gray"}>Cancelar</AlertDialog.Action>
								<AlertDialog.Action onClick={handleDeletion}>
									Deletar
								</AlertDialog.Action>
							</AlertDialog.ButtonsContainer>
						</AlertDialog.Content>
					</AlertDialog.Portal>
				</AlertDialog.Root>
				<HookedForm.Space height={2} />
				<HookedForm.Separator />
				<HookedForm.Space height={2} />

				<GridControlsContainer>
					<StateSwitch
						className={styles.gridSwitch}
						label={"Show Grid"}
						state={showGridState}
					/>
					<input
						type="color"
						value={gridColors.primary}
						onChange={(event) =>
							setGridColors((current) => ({
								...current,
								primary: event.target.value,
							}))
						}
					/>

					<input
						type="color"
						value={gridColors.secondary}
						onChange={(event) =>
							setGridColors((current) => ({
								...current,
								secondary: event.target.value,
							}))
						}
					/>
				</GridControlsContainer>
			</EditorCoreRightContainer>
		</GridMapsEditorContainer>
	);
}

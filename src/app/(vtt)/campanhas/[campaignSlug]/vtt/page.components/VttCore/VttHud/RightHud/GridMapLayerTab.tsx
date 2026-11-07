import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./GridMapLayerTab.module.css";
import { useVttGridMapStore } from "../../../Stores/VttGridMapStore";
import { Guid } from "@/libs/stp@types";
import { useVttThrottledViewportContext } from "../../../Contexts/VttThrottledViewportContext";
import { BasicMedia } from "@/components/(Design)/components/BasicMedia";
import { setVttElementHoverInteraction } from "../../../Utils/ElementDataAttributeUtils";
import { HookedForm } from "@/libs/stp@forms";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const GridMapLayerTabContainer = newStyledElement.div(
	styles.gridMapLayerTabContainer,
);

const schema = z.object({
	query: z.string(),
});
type FormData = z.infer<typeof schema>;

export function GridMapLayerTab() {
	const vttGridMapIds = useVttGridMapStore((state) => state.order);
	const [filterString, setFilterString] = useState<string | null>(null);

	function handleAction({ query }: FormData) {
		if (query.trim().length < 1) setFilterString(null);
		else setFilterString(query.trim().toLowerCase());
	}

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: "all",
		defaultValues: {
			query: "",
		},
	});

	return (
		<GridMapLayerTabContainer>
			<HookedForm.Form
				form={form}
				actionDebounceMs={300}
				onChangeAction={handleAction}>
				<HookedForm.TextInput<FormData>
					fieldName={"query"}
					label={""}
					placeholder={"Filtrar GridMaps"}
					style={{
						textAlign: "center",
						paddingTop: "10px",
						paddingBottom: "10px",
						color: "var(--cl-gray-300)",
						backgroundColor: "var(--cl-gray-900)",
					}}
				/>
			</HookedForm.Form>
			{vttGridMapIds.toReversed().map((vttGridMapId) => (
				<VttGridMapTabEntry
					key={vttGridMapId}
					vttGridMapId={vttGridMapId}
					filter={filterString}
				/>
			))}
		</GridMapLayerTabContainer>
	);
}

const VttGridMapTabEntryContainer = newStyledElement.div(
	styles.vttGridMapTabEntryContainer,
);
const VttGridMapTabEntryImageContainer = newStyledElement.div(
	styles.vttGridMapTabEntryImageContainer,
);

interface VttGridMapTabEntryProps {
	vttGridMapId: Guid;
	filter: string | null;
}
function VttGridMapTabEntry({ vttGridMapId, filter }: VttGridMapTabEntryProps) {
	const vttGridMap = useVttGridMapStore((state) =>
		state.gridMaps.get(vttGridMapId),
	);
	const animateCamera = useVttThrottledViewportContext(
		(state) => state.animateCamera,
		300,
	);
	if (
		!vttGridMap ||
		(filter && !vttGridMap.gridMap.name.toLowerCase().includes(filter))
	)
		return null;

	return (
		<VttGridMapTabEntryContainer
			{...setVttElementHoverInteraction("Pointer")}
			onClick={() => animateCamera({ position: vttGridMap.coordinates })}>
			<VttGridMapTabEntryImageContainer>
				<BasicMedia
					src={vttGridMap.gridMap.imageUrl}
					alt={"????"}
					className={styles.media}
					width={40}
					height={40}
				/>
			</VttGridMapTabEntryImageContainer>
			{vttGridMap.gridMap.name}
		</VttGridMapTabEntryContainer>
	);
}

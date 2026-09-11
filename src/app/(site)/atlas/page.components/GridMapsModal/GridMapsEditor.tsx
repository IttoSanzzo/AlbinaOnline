"use client";

import { Guid } from "@/libs/stp@types";
import { Dispatch, SetStateAction } from "react";

interface GridMapsEditorProps {
	setEditingGridMapId: Dispatch<SetStateAction<Guid | null>>;
}
export function GridMapsEditor({ setEditingGridMapId }: GridMapsEditorProps) {
	void setEditingGridMapId;
	return <></>;
}

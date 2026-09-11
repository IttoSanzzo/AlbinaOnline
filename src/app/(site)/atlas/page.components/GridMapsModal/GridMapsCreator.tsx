"use client";

import { Guid } from "@/libs/stp@types";
import { Dispatch, SetStateAction } from "react";

interface GridMapsCreatorProps {
	setEditingGridMapId: Dispatch<SetStateAction<Guid | null>>;
}
export function GridMapsCreator({ setEditingGridMapId }: GridMapsCreatorProps) {
	void setEditingGridMapId;
	return <></>;
}

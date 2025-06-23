"use client";

import { useSetCurrentPageData } from "@/libs/stp@hooks/hooks/useCurrentPageData";
import {
	PageData,
	PageDataType,
} from "@/libs/stp@hooks/stores/useCurrentPageDataStore";

interface SetCurrentPageDataProps {
	type: PageDataType;
	data: PageData;
}
export function SetCurrentPageData({ type, data }: SetCurrentPageDataProps) {
	useSetCurrentPageData(type, data, { resetOnUnmount: true });
	return null;
}

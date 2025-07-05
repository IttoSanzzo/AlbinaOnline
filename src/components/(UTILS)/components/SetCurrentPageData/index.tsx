"use client";

import {
	PageData,
	PageDataType,
	useSetCurrentPageData,
} from "@/libs/stp@hooks";

interface SetCurrentPageDataProps {
	type: PageDataType;
	data: PageData;
}
export function SetCurrentPageData({ type, data }: SetCurrentPageDataProps) {
	useSetCurrentPageData(type, data, { resetOnUnmount: true });
	return null;
}

"use client";

import { useEffect } from "react";
import {
	PageData,
	PageDataType,
	useCurrentPageDataStore,
} from "../stores/useCurrentPageDataStore";
import { useShallow } from "zustand/react/shallow";

export function useCurrentPageData() {
	return useCurrentPageDataStore(
		useShallow((state) => ({
			type: state.type,
			data: state.data,
			isSet: state.isSet,
			reset: state.reset,
		}))
	);
}

export function useSetCurrentPageData(
	type: PageDataType,
	data: PageData,
	options?: { resetOnUnmount?: boolean }
) {
	const { setType, setData, setIsSet, reset } = useCurrentPageDataStore(
		useShallow((state) => ({
			setType: state.setType,
			setData: state.setData,
			setIsSet: state.setIsSet,
			reset: state.reset,
		}))
	);
	useEffect(() => {
		setType(type);
		setData(data);
		setIsSet(true);
		return () => {
			if (options?.resetOnUnmount) {
				reset();
			}
		};
	}, [type, data]);
}

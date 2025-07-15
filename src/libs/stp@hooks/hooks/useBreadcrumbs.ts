"use client";

import { useEffect } from "react";
import { useBreadcrumbsStore } from "../stores";
import { useShallow } from "zustand/shallow";
import { Breadcrumb } from "../stores/useBreadcrumbsStore";

export function useBreadcrumbs() {
	return useBreadcrumbsStore(
		useShallow((state) => ({
			breadcrumbs: state.breadcrumbs,
			setBreadcrumbs: state.setBreadcrumbs,
			isSet: state.isSet,
			setIsSet: state.setIsSet,
			clearBreadcrumbs: state.clearBreadcrumbs,
		}))
	);
}

export function useSetBreadcrumbs(
	breadcrumbs: Breadcrumb[],
	options?: { resetOnUnmount?: boolean }
) {
	const { setBreadcrumbs, setIsSet, clearBreadcrumbs } = useBreadcrumbsStore(
		useShallow((state) => ({
			breadcrumbs: state.breadcrumbs,
			setBreadcrumbs: state.setBreadcrumbs,
			isSet: state.isSet,
			setIsSet: state.setIsSet,
			clearBreadcrumbs: state.clearBreadcrumbs,
		}))
	);

	useEffect(() => {
		setBreadcrumbs(breadcrumbs);
		setIsSet(true);
		return () => {
			if (options?.resetOnUnmount) {
				clearBreadcrumbs();
			}
		};
	}, [breadcrumbs]);
}

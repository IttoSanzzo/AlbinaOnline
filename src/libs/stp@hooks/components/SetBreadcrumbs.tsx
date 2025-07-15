"use client";

import { Breadcrumb, useSetBreadcrumbs } from "@/libs/stp@hooks";

interface SetBreadcrumbsProps {
	breadcrumbs: Breadcrumb[];
}
export function SetBreadcrumbs({ breadcrumbs }: SetBreadcrumbsProps) {
	useSetBreadcrumbs(breadcrumbs, { resetOnUnmount: true });
	return null;
}

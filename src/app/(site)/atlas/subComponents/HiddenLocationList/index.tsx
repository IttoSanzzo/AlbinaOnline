"use client";

import { useCurrentUser } from "@/libs/stp@hooks";
import { RoleHierarchy } from "@/libs/stp@types";
import { HiddenLocationListExtra } from "./extra";

export function HiddenLocationList() {
	const { user, loading } = useCurrentUser();
	if (
		loading ||
		user == null ||
		RoleHierarchy[user.role] < RoleHierarchy.Master
	)
		return null;
	return <HiddenLocationListExtra />;
}

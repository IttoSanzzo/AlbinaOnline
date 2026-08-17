"use client";

import { CreatureData, RoleHierarchy } from "@/libs/stp@types";
import { useEffect, useLayoutEffect, useState } from "react";
import { BestiarySearchWithLevel } from "./BestiarySearchWithLevel";
import { useCurrentUser } from "@/libs/stp@hooks";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";

interface BestiarySearchWithHiddenProps {
	publicCreatures: CreatureData[];
}
export function BestiarySearchWithHidden({
	publicCreatures,
}: BestiarySearchWithHiddenProps) {
	const [creatures, setCreatures] = useState<CreatureData[]>(publicCreatures);
	const { user } = useCurrentUser();

	useLayoutEffect(() => {
		if (user == null || RoleHierarchy[user.role] < RoleHierarchy.Master) return;
		(async () => {
			const response = await fetch(
				getAlbinaApiFullAddress("/bestiary/include-hidden?mode=lite"),
				{
					next: { tags: ["/bestiary"] },
				},
			);
			if (!response.ok) return;
			setCreatures(await response.json());
		})();
	}, [user]);

	return <BestiarySearchWithLevel creatures={creatures} />;
}

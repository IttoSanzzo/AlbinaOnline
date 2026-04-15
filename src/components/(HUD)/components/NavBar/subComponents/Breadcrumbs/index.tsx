"use client";

import { usePathname } from "next/navigation";
import { capitalizeTitle } from "@/utils/StringUtils";
import { Breadcrumb, useBreadcrumbs } from "@/libs/stp@hooks";
import { StyledLink } from "@/components/(Design)";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { useEffect, useMemo } from "react";
import { StyledFalseLink } from "@/components/(Design)/components/StyledFalseLink";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { useNavigationHistory } from "@/libs/stp@hooks/hooks/useNavigationHistory";

const BreadcrumbContainer = newStyledElement.div(styles.breadcrumbContainer);

function segmentToApiRoute(segment: string): string {
	switch (segment) {
		case "maestrias":
			return "masteries";
		case "tracos":
			return "traits";
		case "racas":
			return "races";
		default:
			return segment;
	}
}

export function Breadcrumbs() {
	const pathName = usePathname();
	const autoCrumbs: Breadcrumb[] = useMemo(() => {
		const segments = pathName.split("/").filter(Boolean);
		const linkSegments = [segmentToApiRoute(segments[0]), ...segments.slice(1)];
		const allLinks: string[] = Array.from(
			{ length: segments.length },
			(_, i) => {
				return `/${segments.slice(0, i + 1).join("/")}`;
			},
		);
		return Array.from({ length: allLinks.length }, (_, i) => {
			return {
				name: capitalizeTitle(segments[i].replace(/[-]+/g, " ")),
				href: allLinks[i],
				icon: getAlbinaApiFullAddress(
					`/favicon/${linkSegments.slice(0, i + 1).join("/")}`,
				),
			};
		});
	}, [pathName]);
	const { breadcrumbs } = useBreadcrumbs();
	const { addHistoryEntry, isSet, loadHistory } = useNavigationHistory();
	const crumbs = breadcrumbs.length === 0 ? autoCrumbs : breadcrumbs;

	useEffect(() => {
		if (window.self !== window.top) return;
		if (!isSet) loadHistory();
		try {
			const url = pathName;
			const lastCrumb = crumbs[crumbs.length - 1];
			addHistoryEntry({
				name:
					lastCrumb.name.length <= 16
						? lastCrumb.name
						: `${lastCrumb.name.substring(0, 15)}...`,
				icon: lastCrumb.icon ?? getAlbinaApiFullAddress("/favicon/home"),
				url: url,
			});
		} catch {
			return;
		}
	}, [pathName, crumbs, addHistoryEntry, isSet, loadHistory]);

	return (
		<BreadcrumbContainer>
			{crumbs.map((breadcrumb, index) => (
				<span key={breadcrumb.href}>
					{index == crumbs.length - 1 ? (
						<StyledFalseLink
							textMode
							title={breadcrumb.name}
							icon={breadcrumb.icon}
						/>
					) : (
						<StyledLink
							textMode
							href={breadcrumb.href}
							title={breadcrumb.name}
							icon={breadcrumb.icon}
						/>
					)}
					{crumbs.length > index + 1 && <span>/</span>}
				</span>
			))}
		</BreadcrumbContainer>
	);
}

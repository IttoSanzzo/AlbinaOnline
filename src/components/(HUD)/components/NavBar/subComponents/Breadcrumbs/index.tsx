"use client";

import { usePathname } from "next/navigation";
import { capitalizeTitle } from "@/utils/StringUtils";
import { Breadcrumb, useBreadcrumbs } from "@/libs/stp@hooks";
import { StyledLink } from "@/components/(Design)";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { useMemo } from "react";
import { StyledFalseLink } from "@/components/(Design)/components/StyledFalseLink";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const BreadcrumbContainer = newStyledElement.div(styles.breadcrumbContainer);

export function Breadcrumbs() {
	const pathName = usePathname();
	const autoCrumbs: Breadcrumb[] = useMemo(() => {
		const segments = pathName.split("/").filter(Boolean);
		const allLinks: string[] = Array.from(
			{ length: segments.length },
			(_, i) => {
				return `/${segments.slice(0, i + 1).join("/")}`;
			}
		);
		return Array.from({ length: allLinks.length }, (_, i) => {
			return {
				name: capitalizeTitle(segments[i].replace(/[-]+/g, " ")),
				href: allLinks[i],
				icon: `${getAlbinaApiAddress()}/favicon/${segments
					.slice(0, i + 1)
					.join("/")}`,
			};
		});
	}, [pathName]);
	const { breadcrumbs } = useBreadcrumbs();

	const crumbs = breadcrumbs.length === 0 ? autoCrumbs : breadcrumbs;
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

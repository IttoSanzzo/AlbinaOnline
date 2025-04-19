"use client";

import Link from "next/link";
import { BreadcrumbContainer } from "./styledElements";
import { usePathname } from "next/navigation";
import { capitalize } from "@/utils/StringUtils";

export default function Breadcrumb() {
	const pathName = usePathname();
	const allRoutes = pathName.split("/").filter(Boolean);
	const allLinks: string[] = Array.from(
		{ length: allRoutes.length },
		(_, i) => {
			return `/${allRoutes.slice(0, i + 1).join("/")}`;
		}
	);

	const crumbs = Array.from({ length: allLinks.length }, (_, i) => {
		return {
			name: capitalize(allRoutes[i].replace("-", " ")),
			link: allLinks[i],
		};
	});

	return (
		<BreadcrumbContainer>
			{crumbs.map((crumb, index) => {
				return (
					<span key={crumb.name}>
						<Link href={crumb.link}>{crumb.name}</Link>
						{crumbs.length > index + 1 && <span>/</span>}
					</span>
				);
			})}
		</BreadcrumbContainer>
	);
}

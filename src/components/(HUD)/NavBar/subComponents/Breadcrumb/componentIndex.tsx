import Link from "next/link";
import { BreadcrumbContainer } from "./styledElements";

export default function Breadcrumb() {
	const crumbs = [
		{
			name: "test",
			link: "/",
		},
		{
			name: "home",
			link: "/home",
		},
	];

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

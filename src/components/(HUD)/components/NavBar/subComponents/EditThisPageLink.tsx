"use client";

import { StpIcon } from "@/libs/stp@icons";
import styles from "./EditThisPageLink.module.css";
import { useCurrentUser } from "@/libs/stp@hooks";
import { RoleHierarchy } from "@/libs/stp@types";
import { newStyledElement } from "@setsu-tp/styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";

const EditThisPageLinkContainer = newStyledElement.div(
	styles.editThisPageLinkContainer,
);

const editablePageRoot = [
	"items",
	"maestrias",
	"skills",
	"spells",
	"tracos",
	"racas",
	"atlas",
	"bestiario",
];

export function EditThisPageLink() {
	const { loading, user } = useCurrentUser();
	const pathName = usePathname();

	if (loading || user == null || RoleHierarchy[user.role] < RoleHierarchy.Admin)
		return null;

	if (pathName.endsWith("/edit"))
		return (
			<EditThisPageLinkContainer>
				<Link
					href={pathName.substring(0, pathName.length - 5)}
					prefetch={false}>
					<StpIcon
						name="PencilSlash"
						color="purple"
					/>
				</Link>
			</EditThisPageLinkContainer>
		);

	const splittedPathname = pathName.split("/");
	if (
		splittedPathname.length < 3 ||
		!editablePageRoot.includes(splittedPathname[1])
	)
		return null;

	return (
		<EditThisPageLinkContainer>
			<Link
				href={`${pathName}/edit`}
				prefetch={false}>
				<StpIcon
					name="Pencil"
					color="purple"
				/>
			</Link>
		</EditThisPageLinkContainer>
	);
}

"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./EditMiniLink.module.css";
import { useCurrentUser } from "@/libs/stp@hooks";
import Link from "next/link";
import { StpIcon } from "@/libs/stp@icons";
import { RoleHierarchy } from "@/libs/stp@types";

const EditMiniLinkContainer = newStyledElement.div(
	styles.editMiniLinkContainer,
);

interface EditMiniLinkProps {
	baseHref: string;
	position?: "top-left" | "center-right";
}
export function EditMiniLink({
	baseHref,
	position = "center-right",
}: EditMiniLinkProps) {
	const { loading, user } = useCurrentUser();

	if (loading || user == null || RoleHierarchy[user.role] < RoleHierarchy.Admin)
		return null;

	return (
		<EditMiniLinkContainer className={styles[position]}>
			<Link
				tabIndex={-1}
				href={`${baseHref}/edit`}
				prefetch={false}>
				<StpIcon
					name="Pencil"
					color="purple"
				/>
			</Link>
		</EditMiniLinkContainer>
	);
}

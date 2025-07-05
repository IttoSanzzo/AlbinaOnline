"use client";

import Link from "next/link";
import {
	AnchorItem,
	AnchorLine,
	AnchorLines,
	AnchorNavBarContainer,
	TableOfContents,
} from "./styledElements";
import styles from "./styles.module.css";
import { useVisibleSections } from "@/utils/Hooks";
import { idfyString } from "@/utils/StringUtils";
import { AnchorProps, useAnchorNavigation } from "@/libs/stp@hooks";

export function AnchorNavBar() {
	const { anchors, isSet } = useAnchorNavigation();
	const refinedAnchors: AnchorProps[] = anchors
		? anchors.map((anchor) => {
				return {
					name: anchor.name,
					id: idfyString(anchor.id),
				};
		  })
		: [];
	const visibleId = useVisibleSections(
		refinedAnchors?.map((anchor) => anchor.id)
	);
	if (isSet === false || !anchors?.length) return null;

	return (
		<AnchorNavBarContainer>
			<AnchorLines>
				{refinedAnchors.map((anchor) => (
					<AnchorLine
						key={anchor.id}
						className={
							anchor.id === visibleId ? styles["activeAnchorLine"] : undefined
						}
					/>
				))}
				<TableOfContents>
					{refinedAnchors.map((anchor) => (
						<AnchorItem
							key={anchor.id}
							className={
								anchor.id === visibleId ? styles["activeAnchorItem"] : undefined
							}>
							<Link href={`#${anchor.id}`}>
								》<div>{anchor.name}</div>
							</Link>
						</AnchorItem>
					))}
				</TableOfContents>
			</AnchorLines>
		</AnchorNavBarContainer>
	);
}

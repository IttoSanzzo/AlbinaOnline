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

export type AnchorProps = {
	name: string;
	id: string;
};

interface AnchorNavBarProps {
	anchors: AnchorProps[];
}

export function AnchorNavBar({ anchors }: AnchorNavBarProps) {
	if (anchors.length == 0) return <AnchorNavBarContainer />;

	const visibleId = useVisibleSections(anchors.map((anchor) => anchor.id));

	return (
		<AnchorNavBarContainer>
			<AnchorLines>
				{anchors.map((anchor, index) => (
					<AnchorLine
						key={index}
						className={
							anchor.id === visibleId ? styles["activeAnchorLine"] : undefined
						}
					/>
				))}
				<TableOfContents>
					{anchors.map((anchor) => (
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

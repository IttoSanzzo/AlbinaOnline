import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { useLayoutEffect, useState } from "react";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableStyledLink } from "@/components/(SPECIAL)";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { UserFavoriteType } from "@/libs/stp@types";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { UIBasics } from "@/components/(UIBasics)";

const SortableIndexedPagesGroupContainer = newStyledElement.div(
	styles.sortableIndexedPagesGroupContainer
);
const SortableIndexedPageLinksContainer = newStyledElement.div(
	styles.sortableIndexedPageLinksContainer
);

export interface SortableIndexedPage {
	name: string;
	image?: string;
	link: string;
}

function genReordenatedArray(
	length: number,
	fromIndex: number,
	toValue: number
): number[] {
	const result: number[] = new Array(length).fill(-1);
	result[fromIndex] = toValue;
	let fillValue = 0;
	for (let i = 0; i < length; ++i) {
		if (i === fromIndex) continue;
		if (fillValue === toValue) ++fillValue;
		result[i] = fillValue++;
	}
	return result;
}

async function postReorderAsync(
	type: UserFavoriteType,
	length: number,
	oldPosition: number,
	newPosition: number
) {
	await authenticatedFetchAsync(
		`${getAlbinaApiAddress()}/users/me/favorites/reorder`,
		{
			headers: {
				"Content-Type": "application/json",
			},
			method: "PATCH",
			body: JSON.stringify({
				type,
				newOrder: genReordenatedArray(length, oldPosition, newPosition),
			}),
		}
	);
}

interface SortableIndexedPagesGroupProps {
	groupName: string;
	groupType: UserFavoriteType;
	indexedPages: SortableIndexedPage[];
}
export default function SortableIndexedPagesGroup({
	groupName,
	groupType,
	indexedPages,
}: SortableIndexedPagesGroupProps) {
	const [pageLinks, setPageLinks] = useState(indexedPages);

	useLayoutEffect(() => {
		setPageLinks(indexedPages);
	}, [indexedPages]);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = pageLinks.findIndex((pl) => pl.link === active.id);
		const newIndex = pageLinks.findIndex((pl) => pl.link === over.id);

		const newPageLinks = arrayMove(pageLinks, oldIndex, newIndex);
		setPageLinks(newPageLinks);

		postReorderAsync(groupType, newPageLinks.length, oldIndex, newIndex);
	}

	return (
		<SortableIndexedPagesGroupContainer>
			<UIBasics.Toggle
				memoryId={`IndexedPages/${groupName}`}
				routeSensitiveMemory={false}
				contentMargin="none"
				textColor="orange"
				title={<h6>{groupName}</h6>}>
				<DndContext
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}>
					<SortableIndexedPageLinksContainer>
						<SortableContext
							items={pageLinks.map((pl) => pl.link)}
							strategy={verticalListSortingStrategy}>
							{pageLinks.map((indexedPage) => (
								<SortableStyledLink
									key={indexedPage.link}
									linkProps={{
										title: indexedPage.name,
										href: indexedPage.link,
										icon:
											indexedPage.image != undefined
												? indexedPage.image
												: `${getAlbinaApiAddress()}/favicon/${
														indexedPage.link
												  }`,
									}}
								/>
							))}
						</SortableContext>
					</SortableIndexedPageLinksContainer>
				</DndContext>
			</UIBasics.Toggle>
		</SortableIndexedPagesGroupContainer>
	);
}

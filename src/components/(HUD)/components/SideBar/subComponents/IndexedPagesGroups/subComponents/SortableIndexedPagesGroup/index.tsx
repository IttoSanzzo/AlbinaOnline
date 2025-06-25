import {
	SortableIndexedPageLinksContainer,
	SortableIndexedPagesGroupContainer,
} from "./styledElements";
import { NotionToggle } from "@/components/(NotionBased)";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { userFavoriteType } from "@/libs/stp@types";
import { useLayoutEffect, useState } from "react";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableStyledLink } from "@/components/(SPECIAL)";
import { authenticatedFetchAsync } from "@/utils/FetchTools";

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
	type: userFavoriteType,
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
	groupType: userFavoriteType;
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
			<NotionToggle
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
			</NotionToggle>
		</SortableIndexedPagesGroupContainer>
	);
}

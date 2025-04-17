import { ReactNode } from "react";
import { IndexedPageLink, IndexedPagesGroupContainer } from "./styledElements";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { NotionToggle } from "@/components/(NotionBased)";

export interface IndexedPage {
	name: string;
	image: string | StaticImageData;
	link: string;
}

interface IndexedPagesGroupProps {
	groupName: string;
	indexedPages: IndexedPage[];
}

export default function IndexedPagesGroup({
	groupName,
	indexedPages,
}: IndexedPagesGroupProps) {
	return (
		<IndexedPagesGroupContainer>
			<NotionToggle
				memoryId={`IndexedPages/${groupName}`}
				routeSensitiveMemory={false}
				contentMargin="middle"
				textColor="orange"
				title={<h6>{groupName}</h6>}>
				{indexedPages.map((indexedPage) => (
					<IndexedPageLink key={indexedPage.link}>
						<Link href={indexedPage.link}>
							<Image
								src={indexedPage.image}
								alt=""
								width={18}
								height={18}
							/>
							<span>{indexedPage.name}</span>
						</Link>
					</IndexedPageLink>
				))}
			</NotionToggle>
		</IndexedPagesGroupContainer>
	);
}

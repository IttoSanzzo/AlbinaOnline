import {
	IndexedPageLinksContainer,
	IndexedPagesGroupContainer,
} from "./styledElements";
import { NotionToggle } from "@/components/(NotionBased)";
import { StyledLink } from "@/components/(Design)";

export interface IndexedPage {
	name: string;
	image?: string;
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
				contentMargin="none"
				textColor="orange"
				title={<h6>{groupName}</h6>}>
				<IndexedPageLinksContainer>
					{indexedPages.map((indexedPage) => (
						<StyledLink
							key={indexedPage.link}
							title={indexedPage.name}
							href={indexedPage.link}
							icon={
								indexedPage.link[0] == "/"
									? `${process.env.ALBINA_API}/favicon/${indexedPage.link}`
									: indexedPage.image
							}
						/>
					))}
				</IndexedPageLinksContainer>
			</NotionToggle>
		</IndexedPagesGroupContainer>
	);
}

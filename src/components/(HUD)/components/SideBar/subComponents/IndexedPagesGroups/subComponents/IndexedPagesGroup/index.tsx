import { StyledLink } from "@/components/(Design)";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { UIBasics } from "@/components/(UIBasics)";

const IndexedPagesGroupContainer = newStyledElement.div(
	styles.indexedPagesGroupContainer
);
const IndexedPageLinksContainer = newStyledElement.div(
	styles.indexedPageLinksContainer
);

export interface IndexedPage {
	name: string;
	image?: string;
	link: string;
}

interface IndexedPagesGroupProps {
	groupName: string;
	indexedPages: IndexedPage[];
	defaultOpenState?: boolean;
}
export default function IndexedPagesGroup({
	groupName,
	indexedPages,
	defaultOpenState = false,
}: IndexedPagesGroupProps) {
	return (
		<IndexedPagesGroupContainer>
			<UIBasics.Toggle
				memoryId={`IndexedPages/${groupName}`}
				defaultOpenState={defaultOpenState}
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
								indexedPage.image != undefined
									? indexedPage.image
									: `${getAlbinaApiFullAddress()}/favicon/${indexedPage.link}`
							}
						/>
					))}
				</IndexedPageLinksContainer>
			</UIBasics.Toggle>
		</IndexedPagesGroupContainer>
	);
}

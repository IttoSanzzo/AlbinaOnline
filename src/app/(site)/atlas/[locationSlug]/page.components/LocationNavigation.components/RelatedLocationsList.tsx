import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./RelatedLocationsList.module.css";
import { LocationDataWithExpandedLinks } from "@/libs/stp@types";
import { UIBasics } from "@/components/(UIBasics)";
import { StpIcon } from "@/libs/stp@icons";
import { LocationLinkDisplay } from "./RelatedLocationsList.components/LocationLinkDisplay";
import { LocationLinkExpanded } from "@/libs/stp@types/dataTypes/locationLink";

const RelatedLocationsListsContainer = newStyledElement.div(
	styles.relatedLocationsListsContainer,
);
const ListContainer = newStyledElement.div(styles.listContainer);
const LinkList = newStyledElement.div(styles.linkList);

interface RelatedLocationsListProps {
	locationData: LocationDataWithExpandedLinks;
}
export async function RelatedLocationsList({
	locationData,
}: RelatedLocationsListProps) {
	const parentLinks = locationData.parentLocationLinks.filter(
		(link: LocationLinkExpanded) => link.parentLocationId != locationData.id,
	);
	const childLinks = locationData.childLocationLinks as LocationLinkExpanded[];

	return (
		<RelatedLocationsListsContainer>
			<div>
				{parentLinks.length > 0 && (
					<ListContainer>
						<UIBasics.Header
							headerType="h3"
							textAlign="center"
							textColor="gray"
							className={styles.title}
							withoutMargin>
							<StpIcon
								name="PaperPlaneRight"
								style="bold"
								color="red"
								mirror
							/>
							Externos
							<StpIcon
								name="PaperPlaneRight"
								style="bold"
								color="red"
							/>
						</UIBasics.Header>
						<LinkList>
							{parentLinks.map((link) => (
								<LocationLinkDisplay
									key={link.id}
									isChild={false}
									locationLink={link}
								/>
							))}
						</LinkList>
					</ListContainer>
				)}
				{childLinks.length > 0 && (
					<ListContainer>
						<UIBasics.Header
							headerType="h3"
							textAlign="center"
							textColor="gray"
							className={styles.title}
							withoutMargin>
							<StpIcon
								name="PaperPlaneRight"
								style="bold"
								color="blue"
							/>
							Internos
							<StpIcon
								name="PaperPlaneRight"
								style="bold"
								color="blue"
								mirror
							/>
						</UIBasics.Header>
						<LinkList>
							{childLinks.map((link) => (
								<LocationLinkDisplay
									key={link.id}
									isChild={true}
									locationLink={link}
								/>
							))}
						</LinkList>
					</ListContainer>
				)}
			</div>
		</RelatedLocationsListsContainer>
	);
}
